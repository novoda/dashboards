const functions = require('firebase-functions')
const admin = require('firebase-admin');
const http = require('request-promise-native')
const HtmlRepository = require('./html-repository')
const Scheduler = require('./scheduler/scheduler')
const cors = require('cors')({ origin: true });
const Actions = require('./actions')
admin.initializeApp(functions.config().firebase);

const bucket = admin.storage().bucket()
const htmlRepository = new HtmlRepository(bucket)

const actions = new Actions(admin.database())

exports.onPluginInstanceWrite = functions.database.ref('/v2/plugin_instances/{pluginId}/{pluginInstanceId}/').onWrite(event => {
    const payload = event.data.val()
    const pluginInstanceId = event.params.pluginInstanceId
    return actions.applyPluginInstanceName(pluginInstanceId, payload.name)
})

exports.onNewTopic = functions.database.ref('/v2/topics/{topicId}').onCreate(event => {
    const topicId = event.params.topicId
    return actions.applyInitialIndexToTopic(topicId)
})

exports.onPluginInstanceAddedToTopic = functions.database.ref('/v2/topics/{topicId}/plugin_instances/{instanceId}').onCreate(event => {
    const pluginInstanceId = event.params.instanceId
    const topicId = event.params.topicId
    return Promise.all([
        actions.queryPluginInstanceData(pluginInstanceId),
        actions.queryPluginInstanceName(pluginInstanceId),
        actions.incrementPluginInstanceCountForTopic(topicId),
        actions.applyInstanceToTopic(pluginInstanceId, topicId)
    ]).then(result => {
        console.log('Fetched dependencies for writing instance data to topic', result)
        return actions.applyPluginInstanceToTopic(topicId, pluginInstanceId, result[1], result[0])
    })
})

exports.onTopicCurrentIndexUpdated = functions.database.ref('/v2/topics_index/{topicId}/current_index').onUpdate(event => {
    const topicId = event.params.topicId
    const currentIndex = event.data.val()
    return actions.queryDeviceIdsByTopic(topicId)
        .then(deviceIds => {
            const pushHtmlToDevice = deviceIds.map(deviceId => {
                return pushHtmlToDeviceForTopic(deviceId, topicId, currentIndex)
            })
            return Promise.all(pushHtmlToDevice)
        })
        .catch(err => {
            console.log('Failed to push topic html to device', topicId, err)
        })
})

exports.onDeviceAddedToTopic = functions.database.ref('/v2/topic_to_devices/{topicId}/{deviceId}').onCreate(event => {
    const topicId = event.params.topicId
    const deviceId = event.params.deviceId
    return actions.queryTopicCurrentIndex(topicId)
        .then(currentIndex => {
            return pushHtmlToDeviceForTopic(deviceId, topicId, currentIndex)
        })
})

const pushHtmlToDeviceForTopic = (deviceId, topicId, index) => {
    return actions.queryTopicHtml(topicId, index)
        .then((html) => actions.applyHtmlToDeviceData(deviceId, html))
        .catch((err) => console.error(topicId, deviceId, index, err))
}

exports.onMasterTick = functions.database.ref('/v2/master_index').onUpdate(event => {
    const database = event.data.ref.root
    const tickValue = event.data.val()
    const projectId = process.env.GCLOUD_PROJECT
    const scheduler = new Scheduler(projectId, http, database, htmlRepository)
    return scheduler.tick(tickValue)
})

exports.masterTick = functions.https.onRequest((request, response) => {
    admin.database()
        .ref('/v2/master_index')
        .transaction(current => {
            return (current || 0) + 1
        })
        .then(() => {
            response.status(200).send()
        })
        .catch(error => {
            response.status(500).send(error)
        })
})

exports.onPluginInstancesDataUpdated = functions.database.ref('/v2/plugin_instances_data/{pluginInstanceId}').onWrite(event => {
    const pluginInstanceId = event.params.pluginInstanceId
    const updatedHtml = event.data.val()
    console.log('instance data updated', pluginInstanceId)
    return actions.queryTopicIdsForPluginInstance(pluginInstanceId)
        .then(topicIds => {
            const updateHtml = topicIds.map(topicId => {
                console.log('set html', topicId, pluginInstanceId)
                return actions.applyHtmlToTopicPluginInstanceData(topicId, pluginInstanceId, updatedHtml)
            })
            return Promise.all(updatedHtml)
        })
        .catch(err => {
            console.error('Failed to update topic data as the instance is not in a topic', pluginInstanceId, err)
        })
})

exports.pluginCallback = functions.https.onRequest((request, response) => {
    const pluginInstanceId = request.query.pluginInstanceId
    const html = request.body.html

    console.log('plugin callback', pluginInstanceId)

    return htmlRepository.store(pluginInstanceId, html)
        .then(url => {
            actions.applyPluginInstanceDataHtml(pluginInstanceId, url)
                .then(() => {
                    return response.status(200).send()
                })
                .catch(error => {
                    return response.status(500).send(err)
                })
        })
})

exports.addPlugin = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const pluginEndpoint = request.body.pluginEndpoint

        const createRequest = {
            url: pluginEndpoint,
            body: JSON.stringify({
                type: 'create'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        http.post(createRequest)
            .then(response => {
                const plugin = JSON.parse(response)
                const pluginId = Object.keys(plugin)[0]
                plugin[pluginId].query_url = pluginEndpoint
                return actions.updatePlugin(plugin)
            })
            .then(() => {
                response.status(200).send()
            })
            .catch(error => {
                response.status(500).send(error)
            })
    })
})

exports.onDeviceDeleted = functions.database.ref('/v2/devices/{deviceId}').onDelete(event => {
    const database = event.data.ref.root
    const deviceId = event.params.deviceId
    const devicesData = database.child(`/v2/devices_data/${deviceId}`).remove()

    const topicToDevice = actions.queryTopicsForAllDevices()
        .then(value => {
            const deleteTopicToDevice = Object.keys(value)
                .map(key => {
                    const topic = value[key]
                    return {
                        topicId: key,
                        deviceIds: Object.keys(topic)
                    }
                })
                .filter(topic => topic.deviceIds.includes(deviceId))
                .map(topic => {
                    return database.child(`/v2/topic_to_devices/${topic.topicId}/${deviceId}`).remove()
                })
            return Promise.all(deleteTopicToDevice)
        })
    return Promise.all([devicesData, topicToDevice])
})

exports.onPluginDeleted = functions.database.ref('v2/plugins/{pluginId}').onDelete(event => {
    const database = event.data.ref.root
    const pluginId = event.params.pluginId
    return database.child(`/v2/plugin_instances/${pluginId}`).remove()
})

exports.onPluginInstanceDeleted = functions.database.ref('v2/plugin_instances/{pluginId}/{instanceId}').onDelete(event => {
    const database = event.data.ref.root
    const instanceId = event.params.instanceId
    const cleanUp = [
        database.child(`/v2/plugin_instances_named/${instanceId}`).remove(),
        database.child(`/v2/plugin_instances_data/${instanceId}`).remove(),
        database.child(`/v2/plugin_instance_to_topic/${instanceId}`).remove()
    ]
    return Promise.all(cleanUp)
})

exports.onPluginInstanceDeletedFromTopic = functions.database.ref('v2/plugin_instance_to_topic/{instanceId}/{topicId}').onDelete(event => {
    const database = event.data.ref.root
    const instanceId = event.params.instanceId
    const topicId = event.params.topicId
    return database.child(`/v2/topics/${topicId}/pluginInstances/{instanceId}`).remove()
})

exports.onPluginInstanceRemovedFromTopic = functions.database.ref('/v2/topics/{topicId}/plugin_instances/{instanceId}').onDelete(event => {
    const pluginInstanceId = event.params.instanceId
    const topicId = event.params.topicId
    return actions.removePluginInstanceFromTopic(pluginInstanceId, topicId)
})

exports.onTopicDeleted = functions.database.ref('v2/topics/{topicId}').onDelete(event => {
    const topicId = event.params.topicId
    return actions.removeTopic(topicId)
})
