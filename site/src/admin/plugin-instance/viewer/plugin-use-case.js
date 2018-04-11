import * as Actions from './plugin-actions'
import { watchPluginData } from '../../../dashboard-repository'
import { loadHtml } from '../../../common/html-loader'

export const watchPluginContent = (dispatch) => (pluginId) => {
    return watchPluginData(pluginId, (url) => {
        loadHtml(url).then(html => {
            dispatch(Actions.onPluginContent(html))
        })
    })
}

export const resetPluginContent = (dispatch) => {
    return (url) => {
        dispatch(Actions.onResetPluginContent())
    }
}
