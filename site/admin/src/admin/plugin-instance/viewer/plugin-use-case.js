import * as Actions from './plugin-actions'
import { watchPluginData } from '../../../dashboard-repository'

export const watchPluginContent = (dispatch) => (pluginId) => {
    return watchPluginData(pluginId, (url) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                dispatch(Actions.onPluginContent(html))
            })
    })
}

