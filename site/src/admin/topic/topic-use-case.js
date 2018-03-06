import { readPluginInstances, pushTopic, setTopic, readTopic } from '../../dashboard-repository'
import * as Actions from './topic-actions'

export const fetchPluginInstances = (dispatch) => async () => {
    dispatch(Actions.loadPluginInstances())
    const pluginInstances = await readPluginInstances()
    dispatch(Actions.pluginInstancesLoaded(pluginInstances))
}

export const fetchPluginInstancesForTopic = (dispatch) => async (topicId) => {
    dispatch(Actions.loadPluginInstances())
    const topic = await readTopic(topicId)
    const pluginInstances = await readPluginInstances()

    const toggledInstances = pluginInstances.map(instance => {
        return {
            ...instance,
            isToggled: topic.pluginInstances.includes(instance.id)
        }
    })
    dispatch(Actions.pluginInstancesLoaded(toggledInstances))
    updateName(dispatch)(topic.name)
}

export const addTopic = async (topic) => {
    const payload = toTopicPayload(topic)
    await pushTopic(payload)
}

export const updateTopic = async (topicId, topic) => {
    const payload = toTopicPayload(topic)
    await setTopic(topicId, payload)
}

const toTopicPayload = (topic) => {
    return {
        name: topic.name,
        plugin_instances: topic.pluginInstances.filter(instance => instance.isToggled)
            .reduce((acc, curr) => {
                return acc[curr.id] = true, acc
            }, {})
    }
}

export const updateName = (dispatch) => (name) => {
    dispatch(Actions.updateName(name))
}

export const updatePluginInstanceToggle = (dispatch) => (id, isToggled) => {
    const payload = { id, isToggled }
    dispatch(Actions.updatePluginInstanceToggle(payload))
}
