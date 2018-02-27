import { readPluginInstancesForPluginId, readPlugin } from '../../dashboard-repository'
import * as Actions from './plugin-actions'
import config from '../../config'

export const fetchPlugin = (dispatch) => async (pluginId) => {
    const plugin = await readPlugin(pluginId)
    const instances = await readPluginInstancesForPluginId(pluginId)
    const pluginWithInstances = { plugin, instances }
    dispatch(Actions.pluginLoaded(pluginWithInstances))
}

export const updateEndpoint = (dispatch) => (endpoint) => {
    dispatch(Actions.pluginEndpointUpdated(endpoint))
}

export const addPlugin = (dispatch) => async (endpoint) => {
    await fetch(config.tempAddPluginUrl, {
        method: 'post',
        body: JSON.stringify({ pluginEndpoint: endpoint }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}
