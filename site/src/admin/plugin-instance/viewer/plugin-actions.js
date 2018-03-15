import { createAction } from 'redux-actions'

export const ON_PLUGIN_CONTENT = 'ON_PLUGIN_CONTENT'
export const onPluginContent = createAction(ON_PLUGIN_CONTENT)

export const ON_RESET_PLUGIN_CONTENT = 'ON_RESET_PLUGIN_CONTENT'
export const onResetPluginContent = createAction(ON_RESET_PLUGIN_CONTENT)