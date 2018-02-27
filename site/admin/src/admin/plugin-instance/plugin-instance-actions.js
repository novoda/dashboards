import { createAction } from 'redux-actions'

export const ON_PLUGIN_INSTANCE_LOADED = 'ON_PLUGIN_INSTANCE_LOADED'
export const pluginLoaded = createAction(ON_PLUGIN_INSTANCE_LOADED)

export const ON_PLUGIN_INSTANCE_WITH_PLUGIN_LOADED = 'ON_PLUGIN_INSTANCE_WITH_PLUGIN_LOADED'
export const pluginInstanceLoaded = createAction(ON_PLUGIN_INSTANCE_WITH_PLUGIN_LOADED)

export const ON_UPDATE_INSTANCE_NAME = 'ON_UPDATE_INSTANCE_NAME'
export const updateInstanceName = createAction(ON_UPDATE_INSTANCE_NAME)

export const ON_UPDATE_CONFIGURATION = 'ON_UPDATE_CONFIGURATION'
export const updateConfiguration = createAction(ON_UPDATE_CONFIGURATION)
