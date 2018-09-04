const functions = require('firebase-functions')
const admin = require('firebase-admin');
const http = require('request-promise-native')
const HtmlRepository = require('./html-repository')
const Scheduler = require('./scheduler/scheduler')
const cors = require('cors')({ origin: true });
const Actions = require('./actions')
admin.initializeApp()

const bucket = admin.storage().bucket()
const htmlRepository = new HtmlRepository(bucket)

const actions = new Actions(admin.database())

exports.onPluginInstanceWrite = functions.database.ref('/v2/plugin_instances/{pluginId}/{pluginInstanceId}/').onWrite((change, context) => {
    const payload = change.after.val()
    const pluginInstanceId = context.params.pluginInstanceId
    return actions.applyPluginInstanceName(pluginInstanceId, payload.name)
})

exports.onNewTopic = functions.database.ref('/v2/topics/{topicId}').onCreate((snapshot, context) => {
    const topicId = context.params.topicId
    return actions.applyInitialIndexToTopic(topicId)
})

exports.onPluginInstanceAddedToTopic = functions.database.ref('/v2/topics/{topicId}/plugin_instances/{instanceId}').onCreate((snapshot, context) => {
    const pluginInstanceId = context.params.instanceId
    const topicId = context.params.topicId
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

exports.onTopicCurrentIndexUpdated = functions.database.ref('/v2/topics_index/{topicId}/current_index').onUpdate((change, context) => {
    const topicId = context.params.topicId
    const currentIndex = change.after.val()
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

exports.onDeviceAddedToTopic = functions.database.ref('/v2/topic_to_devices/{topicId}/{deviceId}').onCreate((snapshot, context) => {
    const topicId = context.params.topicId
    const deviceId = context.params.deviceId
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

exports.onMasterTick = functions.database.ref('/v2/master_index').onUpdate((change, context) => {
    const tickValue = change.after.val()
    const projectId = process.env.GCLOUD_PROJECT
    const scheduler = new Scheduler(projectId, http, admin.database(), htmlRepository)
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

exports.onPluginInstancesDataUpdated = functions.database.ref('/v2/plugin_instances_data/{pluginInstanceId}').onWrite((change, context) => {
    const pluginInstanceId = context.params.pluginInstanceId
    const updatedHtml = change.after.val()
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
            console.log('Failed to update topic data as the instance is not in a topic', pluginInstanceId, err)
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

exports.onDeviceDeleted = functions.database.ref('/v2/devices/{deviceId}').onDelete((snapshot, context) => {
    const deviceId = context.params.deviceId
    const devicesData = admin.database().ref(`/v2/devices_data/${deviceId}`).remove()

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
                    return database.ref(`/v2/topic_to_devices/${topic.topicId}/${deviceId}`).remove()
                })
            return Promise.all(deleteTopicToDevice)
        })
    return Promise.all([devicesData, topicToDevice])
})

exports.onPluginDeleted = functions.database.ref('v2/plugins/{pluginId}').onDelete((snapshot, context) => {
    const pluginId = context.params.pluginId
    return admin.database().ref(`/v2/plugin_instances/${pluginId}`).remove()
})

exports.onPluginInstanceDeleted = functions.database.ref('v2/plugin_instances/{pluginId}/{instanceId}').onDelete((snapshot, context) => {
    const database = admin.database()
    const instanceId = context.params.instanceId
    const cleanUp = [
        database.ref(`/v2/plugin_instances_named/${instanceId}`).remove(),
        database.ref(`/v2/plugin_instances_data/${instanceId}`).remove(),
        database.ref(`/v2/plugin_instance_to_topic/${instanceId}`).remove()
    ]
    return Promise.all(cleanUp)
})

exports.onPluginInstanceDeletedFromTopic = functions.database.ref('v2/plugin_instance_to_topic/{instanceId}/{topicId}').onDelete((snapshot, context) => {
    const instanceId = context.params.instanceId
    const topicId = context.params.topicId
    return admin.database().ref(`/v2/topics/${topicId}/pluginInstances/{instanceId}`).remove()
})

exports.onPluginInstanceRemovedFromTopic = functions.database.ref('/v2/topics/{topicId}/plugin_instances/{instanceId}').onDelete((snapshot, context) => {
    const pluginInstanceId = context.params.instanceId
    const topicId = context.params.topicId
    return actions.removePluginInstanceFromTopic(pluginInstanceId, topicId)
})

exports.onTopicDeleted = functions.database.ref('v2/topics/{topicId}').onDelete((snapshot, context) => {
    const topicId = context.params.topicId
    return actions.removeTopic(topicId)
})
