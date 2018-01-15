import { createAction } from 'redux-actions'

export const ON_PLUGIN_LOADED = 'ON_PLUGIN_LOADED'
export const pluginLoaded = createAction(ON_PLUGIN_LOADED)

export const ON_PLUGIN_ENDPOINT_UPDATED = 'ON_PLUGIN_ENDPOINT_UPDATED'
export const pluginEndpointUpdated = createAction(ON_PLUGIN_ENDPOINT_UPDATED)
