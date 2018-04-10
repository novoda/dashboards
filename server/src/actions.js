const readNonEmptySnapshot = (snapshot) => {
    const value = snapshot.val()
    return value ? Promise.resolve(value) : Promise.reject('snapshot is empty')
}

module.exports = class Actions {

    constructor(database) {
        this.database = database
    } 

    incrementPluginInstanceCountForTopic(topicId) {
        return this.database
            .ref(`/v2/topics_index/${topicId}/plugin_instances_count`)
            .transaction(current => {
                return (current || 0) + 1
            })
    }

    applyInstanceToTopic(pluginInstanceId, topicId) {
        return this.database
            .ref(`/v2/plugin_instance_to_topic/${pluginInstanceId}/${topicId}`)
            .set(true)
    }

    applyPluginInstanceToTopic(topicId, pluginInstanceId, pluginInstanceName, pluginInstanceData) {
        const payload = {
            name: pluginInstanceName,
            html: pluginInstanceData
        }
        return this.database
            .ref(`/v2/topics_data/${topicId}/${pluginInstanceId}`)
            .set(payload)
    }

    applyPluginInstanceName(pluginInstanceId, pluginInstanceName) {
        return this.database
            .ref(`/v2/plugin_instances_named/${pluginInstanceId}`)
            .set(pluginInstanceName)
    }

    applyInitialIndexToTopic(topicId) {
        return this.database
            .ref(`/v2/topics_index/${topicId}/current_index`)
            .set(0)
    }

    applyHtmlToDeviceData(deviceId, html) {
        return this.database
            .ref(`/v2/devices_data/${deviceId}`)
            .set(html)
    }

    applyHtmlToTopicPluginInstanceData(topicId, pluginInstanceId, html) {
        return this.database
            .ref(`/v2/topics_data/${topicId}/${pluginInstanceId}/html`)
            .set(html)
    }

    applyPluginInstanceDataHtml(pluginInstanceId, html) {
        return this.database
            .ref(`/v2/plugin_instances_data/${pluginInstanceId}`)
            .set(html)
    }

    queryPluginInstanceData(pluginInstanceId) {
        return this.database
            .ref(`/v2/plugin_instances_data/${pluginInstanceId}`)
            .once('value')
            .then(snapshot => snapshot.val())
    }

    queryPluginInstanceName(pluginInstanceId) {
        return this.database
            .ref(`/v2/plugin_instances_named/${pluginInstanceId}`)
            .once('value')
            .then(snapshot => snapshot.val())
    }

    queryTopicHtml(topicId, index) {
        return this.database
            .ref(`/v2/topics_data/${topicId}/`)
            .once('value')
            .then(snapshot => snapshot.val())
            .then(instances => {
                const instanceKey = Object.keys(instances)[index]
                return instances[instanceKey].html
            })
    }

    queryDeviceIdsByTopic(topicId) {
        return this.database
            .ref(`/v2/topic_to_devices/${topicId}`)
            .once('value')
            .then(readNonEmptySnapshot)
            .then(Object.keys)
    }

    queryTopicCurrentIndex(topicId) {
        return this.database
            .ref(`/v2/topics_index/${topicId}/current_index`)
            .once('value')
            .then(snapshot => snapshot.val())
    }

    queryTopicIdsForPluginInstance(pluginInstanceId) {
        return this.database
            .ref(`/v2/plugin_instance_to_topic/${pluginInstanceId}`)
            .once('value')
            .then(readNonEmptySnapshot)
            .then(Object.keys)
    }

    queryTopicsForAllDevices() {
        return this.database
            .ref(`/v2/topic_to_devices/`)
            .once('value')
            .then(snapshot => snapshot.val())
    }

    updatePlugin(plugin) {
        return this.database
            .ref('/v2/plugins')
            .update(plugin)
    }

    removeTopic(topicId) {
        const removeTopicIndex = this.database
            .ref(`/v2/topics_index/${topicId}`)
            .remove()
            .catch(console.err)

        const removeTopicToDevices = this.database
            .ref(`/v2/topic_to_devices/${topicId}`)
            .remove()
            .catch(console.err)

        const removeTopicsData = this.database
            .ref(`/v2/topics_data/${topicId}`)
            .remove()
            .catch(console.err)
        return Promise.all([removeTopicIndex, removeTopicToDevices, removeTopicsData])
    }

    removePluginInstanceFromTopic(pluginInstanceId, topicId) {
        const removeInstanceToTopic = this.database
            .ref(`/v2/plugin_instance_to_topic/${pluginInstanceId}/${topicId}`)
            .remove()
            .catch(console.err)

        const removeTopicInstanceData = this.database
            .ref(`/v2/topics_data/${topicId}/${pluginInstanceId}`)
            .remove()
            .catch(console.err)

        const decrementPluginInstanceCountForTopic = this.database
            .ref(`/v2/topics_index/${topicId}/plugin_instances_count`)
            .transaction(current => {
                return (current || 1) - 1
            })
            .catch(console.err)

        return Promise.all([removeInstanceToTopic, removeTopicInstanceData, decrementPluginInstanceCountForTopic])
    }

}
