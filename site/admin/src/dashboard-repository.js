import * as firebase from './firebase'

export const readDevices = () => {
    return firebase.read('devices')
        .then(emptyOrContinue)
        .then(value => {
            return Object.keys(value).map(key => {
                const deviceFirebase = value[key];
                return {
                    id: key,
                    name: deviceFirebase.name
                };
            });
        })
}

export const readDevice = (deviceId) => {
    return firebase.read(`devices/${deviceId}`)
        .then(value => {
            return {
                id: deviceId,
                name: value.name,
                topicId: value.topic_id
            }
        })
}

export const readPlugins = () => {
    return firebase.read('plugins')
        .then(emptyOrContinue)
        .then(value => {
            return Object.keys(value).map(key => {
                const pluginFirebase = value[key];
                return {
                    id: key,
                    name: pluginFirebase.name
                };
            });
        })
}

export const readPlugin = (pluginId) => {
    return firebase.read(`plugins/${pluginId}`)
        .then(value => {
            return {
                name: value.name,
                id: pluginId,
                queryUrl: value.query_url,
                template: readTemplate(value.template)
            }
        })
}

const readTemplate = (template) => {
    if (!template) {
        return []
    }
    return Object.keys(template).map(key => {
        const templateField = template[key]
        return {
            id: key,
            label: templateField.label,
            type: templateField.type
        }
    })
}

export const readTopics = () => {
    return firebase.read('topics')
        .then(emptyOrContinue)
        .then(value => {
            return Object.keys(value).map(key => {
                const topicFirebase = value[key];
                return {
                    id: key,
                    name: topicFirebase.name
                };
            });
        })
}

export const readTopic = (topicId) => {
    return firebase.read(`topics/${topicId}`)
        .then(value => {
            return {
                id: topicId,
                name: value.name,
                pluginInstances: Object.keys(value.plugin_instances)
            }
        })
}

export const readPluginInstances = () => {
    return firebase.read('plugin_instances')
        .then(emptyOrContinue)
        .then(value => {
            return Object.keys(value).map(key => {
                const pluginInstancesFirebase = value[key];
                return Object.keys(pluginInstancesFirebase).map(instanceKey => {
                    const instanceFirebase = pluginInstancesFirebase[instanceKey]
                    return {
                        id: instanceKey,
                        name: instanceFirebase.name
                    }
                })
            }).reduce((acc, curr) => {
                return acc.concat(curr)
            }, [])
        })
}

export const readPluginInstancesForPluginId = (pluginId) => {
    return firebase.read(`plugin_instances/${pluginId}`)
        .then(emptyOrContinue)
        .then(value => {
            return Object.keys(value).map(key => {
                const instanceField = value[key]
                return {
                    id: key,
                    name: instanceField.name,
                    queryUrl: instanceField.query_url,
                    configuration: instanceField.configuration
                        ? Object.keys(instanceField.configuration).map(key => {
                            const configurationField = instanceField.configuration[key]
                            return {
                                id: key,
                                label: configurationField.label,
                                type: configurationField.type,
                                value: configurationField.value
                            }
                        })
                        : []
                }
            })
        })
}


export const readPluginInstance = (pluginId, pluginInstanceId) => {
    return firebase.read(`plugin_instances/${pluginId}/${pluginInstanceId}`)
        .then(emptyOrContinue)
        .then(value => {
            console.log('fb instance', value)
            return {
                id: pluginInstanceId,
                name: value.name,
                queryUrl: value.query_url,
                configuration: Object.keys(value.configuration).map(key => {
                    const configurationField = value.configuration[key]
                    return {
                        id: key,
                        label: configurationField.label,
                        type: configurationField.type,
                        value: configurationField.value
                    }
                })
            }
        })
}

export const setPluginInstance = (pluginId, instanceId) => (payload) => {
    return firebase.set(`plugin_instances/${pluginId}/${instanceId}`)(payload)
}


const emptyOrContinue = (data) => {
    return data || []
}

export const pushTopic = (topic) => {
    return firebase.push('topics')(topic)
}

export const setTopic = (topicId, payload) => {
    return firebase.set(`topics/${topicId}`)(payload)
}

export const pushPluginInstance = (pluginId) => (payload) => {
    return firebase.push(`plugin_instances/${pluginId}`)(payload)
}

export const setDevice = (deviceId) => (payload) => {
    return firebase.set(`devices/${deviceId}`)(payload)
}

export const setDeviceTopic = (topicId, deviceId) => {
    return firebase.set(`topic_to_devices/${topicId}/${deviceId}`)(true)
}

export const removeDevice = (deviceId) => {
    return firebase.remove(`devices/${deviceId}`)()
}