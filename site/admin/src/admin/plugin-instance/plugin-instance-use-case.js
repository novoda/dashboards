import {
    readPlugin,
    readPluginInstance,
    pushPluginInstance,
    setPluginInstance
} from '../../dashboard-repository'
import * as Actions from './plugin-instance-actions'

export const fetchPlugin = (dispatch) => async (id) => {
    const plugin = await readPlugin(id)
    dispatch(Actions.pluginLoaded(plugin))
}

export const fetchPluginInstance = (dispatch) => async (pluginId, instanceId) => {
    const instance = await readPluginInstance(pluginId, instanceId)
    const plugin = await readPlugin(pluginId)
    const payload = { plugin, instance }
    dispatch(Actions.pluginInstanceLoaded(payload))
}

export const addInstance = async (instanceView) => {
    const payload = toInstancePayload(instanceView)
    await pushPluginInstance(instanceView.pluginId)(payload)
}

export const updateInstance = async (pluginId, instanceId, instanceView) => {
    const payload = toInstancePayload(instanceView)
    await setPluginInstance(pluginId, instanceId)(payload)
}

const toInstancePayload = (instanceView) => {
    return {
        configuration: instanceView.configuration.reduce((acc, curr) => {
            return acc[curr.id] = curr, acc
        }, {}),
        name: instanceView.instanceName,
        query_url: instanceView.queryUrl
    }
}

export const updateConfiguration = (dispatch) => (id, value) => {
    const payload = { id, value }
    dispatch(Actions.updateConfiguration(payload))
}

export const updateInstanceName = (dispatch) => (name) => {
    dispatch(Actions.updateInstanceName(name))
}

