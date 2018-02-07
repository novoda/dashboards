const functions = require('firebase-functions')
const admin = require('firebase-admin');
const http = require('request-promise-native')
const HtmlRepository = require('./html-repository')
const Scheduler = require('./scheduler/scheduler')
const cors = require('cors')({ origin: true });

admin.initializeApp(functions.config().firebase);

const bucket = admin.storage().bucket()
const htmlRepository = new HtmlRepository(bucket)

exports.onPluginInstanceWrite = functions.database.ref('/v2/plugin_instances/{pluginId}/{pluginInstanceId}/').onWrite(event => {
    const payload = event.data.val()
    const pluginInstanceId = event.params.pluginInstanceId
    const database = event.data.ref.root
    return database.child(`/v2/plugin_instances_named/${pluginInstanceId}`).set(payload.name)
})

exports.onNewTopic = functions.database.ref('/v2/topics/{topicId}').onCreate(event => {
    const database = event.data.ref.root
    const topicId = event.params.topicId
    return database.child(`/v2/topics_index/${topicId}/current_index`).set(0)
})

exports.onPluginInstanceAddedToTopic = functions.database.ref('/v2/topics/{topicId}/plugin_instances/{instanceId}').onCreate(event => {
    const pluginInstanceId = event.params.instanceId
    const topicId = event.params.topicId
    const database = event.data.ref.root

    const pluginHtml = database
        .child(`/v2/plugin_instances_data/${pluginInstanceId}`)
        .once('value')
        .then(snapshot => snapshot.val())

    const pluginInstanceName = database
        .child(`/v2/plugin_instances_named/${pluginInstanceId}`)
        .once('value')
        .then(snapshot => snapshot.val())


    const incrementPluginInstanceCountForTopic = database
        .child(`/v2/topics_index/${topicId}/plugin_instances_count`)
        .transaction(current => {
            return (current || 0) + 1
        })

    const instanceToTopics = database
        .child(`/v2/plugin_instance_to_topic/${pluginInstanceId}/${topicId}`)
        .set(true)

    return Promise.all([pluginHtml, pluginInstanceName, incrementPluginInstanceCountForTopic, instanceToTopics])
        .then(result => {
            console.log(result)
            const topicsDataPayload = {
                name: result[1],
                html: result[0]
            }
            return database.child(`/v2/topics_data/${event.params.topicId}/${pluginInstanceId}`)
                .set(topicsDataPayload)
        })
})

exports.onTopicCurrentIndex = functions.database.ref('/v2/topics_index/{topicId}/current_index').onUpdate(event => {
    const topicId = event.params.topicId
    const currentIndex = event.data.val()
    const database = event.data.ref.root
    return database
        .child(`/v2/topic_to_devices/${topicId}`)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(topicToDevices => {
            return Object.keys(topicToDevices)
        })
        .then(deviceIds => {
            const pushHtmlToDevice = deviceIds.map(deviceId => {
                return pushHtmlToDeviceForTopic(database, deviceId, topicId, currentIndex)
            })
            return Promise.all(pushHtmlToDevice)
        })
})

exports.onDeviceAddedToTopic = functions.database.ref('/v2/topic_to_devices/{topicId}/{deviceId}').onCreate(event => {
    const topicId = event.params.topicId
    const deviceId = event.params.deviceId

    const database = event.data.ref.root
    return database.child(`/v2/topics_index/${topicId}/current_index`).once('value')
        .then(snapshot => snapshot.val())
        .then(currentIndex => {
            return pushHtmlToDeviceForTopic(database, deviceId, topicId, currentIndex)
        })
})

const pushHtmlToDeviceForTopic = (database, deviceId, topicId, index) => {
    return readTopicHtmlForIndex(database, topicId, index)
        .then(pushHtmlToDevice(database, deviceId))
        .catch((err) => console.error(topicId, deviceId, index, err))
}

const readTopicHtmlForIndex = (database, topicId, index) => {
    return database
        .child(`/v2/topics_data/${topicId}/`)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(instances => {
            const instanceKey = Object.keys(instances)[index]
            return instances[instanceKey].html
        })
}

const pushHtmlToDevice = (database, deviceId) => (html) => {
    return database
        .child(`/v2/devices_data/${deviceId}`)
        .set(html)
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
    const database = event.data.ref.root
    const pluginInstanceId = event.params.pluginInstanceId
    const updatedHtml = event.data.val()

    console.log('instance data updated', pluginInstanceId)

    return database.child(`/v2/plugin_instance_to_topic/${pluginInstanceId}`).once('value')
        .then(snapshot => snapshot.val())
        .then(instance => {
            return Object.keys(instance)
        })
        .then(topicIds => {
            const updateHtml = topicIds.map(topicId => {

                console.log('set html', topicId, pluginInstanceId)

                return database
                    .child(`/v2/topics_data/${topicId}/${pluginInstanceId}/html`)
                    .set(updatedHtml)
            })
            return Promise.all(updatedHtml)
        })
})

exports.pluginCallback = functions.https.onRequest((request, response) => {
    const pluginInstanceId = request.query.pluginInstanceId
    const html = request.body.html

    console.log('plugin callback', pluginInstanceId)

    htmlRepository.store(pluginInstanceId, html)
        .then(url => {
            admin.database()
                .ref(`/v2/plugin_instances_data/${pluginInstanceId}`)
                .set(url)
                .then(() => {
                    response.status(200).send()
                })
                .catch(error => {
                    response.status(500).send(err)
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
                return admin.database()
                    .ref('/v2/plugins')
                    .update(plugin)
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
    const topicToDevice = database
        .child(`/v2/topic_to_devices/`)
        .once('value')
        .then(snapshot => snapshot.val())
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
    return database.child(`/v2/plugin_instances/${deviceId}`).remove()
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
    const database = event.data.ref.root

    const removeInstanceToTopic = database
        .child(`/v2/plugin_instance_to_topic/${pluginInstanceId}/${topicId}`)
        .remove()
        .catch(console.err)

    const removeTopicInstanceData = database
        .child(`/v2/topics_data/${event.params.topicId}/${pluginInstanceId}`)
        .remove()

    const decrementPluginInstanceCountForTopic = database
        .child(`/v2/topics_index/${topicId}/plugin_instances_count`)
        .transaction(current => {
            return (current || 1) - 1
        })

    return Promise.all([removeInstanceToTopic, removeTopicInstanceData, decrementPluginInstanceCountForTopic])
})
