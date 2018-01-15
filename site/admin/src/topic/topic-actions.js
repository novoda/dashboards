import { createAction } from 'redux-actions'

export const ON_LOADING_PLUGIN_INSTANCES = 'ON_LOADING_PLUGIN_INSTANCES'
export const loadPluginInstances = createAction(ON_LOADING_PLUGIN_INSTANCES)

export const ON_PLUGIN_INSTANCES_LOADED = 'ON_PLUGINS_LOADED'
export const pluginInstancesLoaded = createAction(ON_PLUGIN_INSTANCES_LOADED)

export const UPDATE_NAME = 'UPDATE_TOPIC_NAME'
export const updateName = createAction(UPDATE_NAME)

export const UPDATE_PLUGIN_INSTANCE_TOGGLE = 'UPDATE_PLUGIN_INSTANCE_TOGGLE'
export const updatePluginInstanceToggle = createAction(UPDATE_PLUGIN_INSTANCE_TOGGLE)
