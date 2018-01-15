import { createAction } from 'redux-actions'

export const ON_LOADING_DEVICES = 'ON_LOADING_DEVICES'
export const loadDevices = createAction(ON_LOADING_DEVICES)

export const ON_DEVICES_LOADED = 'ON_DEVICES_LOADED'
export const devicesLoaded = createAction(ON_DEVICES_LOADED)

export const ON_LOADING_PLUGINS = 'ON_LOADING_PLUGINS'
export const loadPlugins = createAction(ON_LOADING_PLUGINS)

export const ON_PLUGINS_LOADED = 'ON_PLUGINS_LOADED'
export const pluginsLoaded = createAction(ON_PLUGINS_LOADED)

export const ON_LOADING_TOPICS = 'ON_LOADING_TOPICS'
export const loadTopics = createAction(ON_LOADING_TOPICS)

export const ON_TOPICS_LOADED = 'ON_TOPICS_LOADED'
export const topicsLoaded = createAction(ON_TOPICS_LOADED)

export const ON_UPDATE_HOME_TAB_SELECTION = "ON_UPDATE_HOME_TAB_SELECTION"
export const selectTab = createAction(ON_UPDATE_HOME_TAB_SELECTION)
