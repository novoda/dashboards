import { handleActions } from 'redux-actions'
import * as Actions from './plugin-instance-actions'

const initialState = {
    pluginId: '',
    pluginName: '',
    queryUrl: '',
    instanceName: '',
    configuration: []
}

export const pluginInstance = handleActions({
    [Actions.ON_PLUGIN_INSTANCE_LOADED]: (state, action) => {
        const plugin = action.payload
        return {
            ...state,
            pluginId: plugin.id,
            pluginName: plugin.name,
            instanceName: '',
            queryUrl: plugin.queryUrl,
            configuration: plugin.template
        }
    },
    [Actions.ON_PLUGIN_INSTANCE_WITH_PLUGIN_LOADED]: (state, action) => {
        const instance = action.payload.instance
        const plugin = action.payload.plugin
        return {
            ...state,
            pluginId: plugin.id,
            pluginName: plugin.name,
            instanceName: instance.name,
            queryUrl: plugin.queryUrl,
            configuration: instance.configuration
        }
    },
    [Actions.ON_UPDATE_INSTANCE_NAME]: (state, action) => {
        return {
            ...state,
            instanceName: action.payload
        }
    },
    [Actions.ON_UPDATE_CONFIGURATION]: (state, action) => {
        const configuration = state.configuration.map(instance => {
            return action.payload.id === instance.id
                ? { ...instance, value: action.payload.value }
                : instance
        })
        return { ...state, configuration: configuration }
    }
}, initialState)
