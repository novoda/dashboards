import * as Actions from './plugin-actions'
import { watchPluginData } from '../../../dashboard-repository'
import { loadHtml } from '../../../common/html-loader'

export const watchPluginContent = (dispatch) => (pluginId) => {
    return watchPluginData(pluginId, (url) => {
            dispatch(Actions.onPluginContent(url))
    })
}

export const resetPluginContent = (dispatch) => {
    return (url) => {
        dispatch(Actions.onResetPluginContent())
    }
}
