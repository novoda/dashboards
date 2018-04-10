import * as Actions from './kiosk-actions'
import { watchDeviceData } from '../dashboard-repository'
import { loadHtml } from '../common/html-loader'

export const watchAnonymousStateChange = (dispatch, auth) => () => {
    return auth.onAuthStateChanged(user => {
        if (user) {
            dispatch(Actions.onAnonymousDeviceId(user.uid))
        } else {
            auth
                .signInAnonymously()
                .catch(console.log)
        }
    })
}

export const watchDeviceContent = (dispatch) => (deviceId) => {
    return watchDeviceData(deviceId, (url) => {
        loadHtml(url).then(html => {
            dispatch(Actions.onDeviceContent(html))
        }).catch((error) => {
            dispatch(Actions.onDeviceContentError(error))
        })
    })
}
export const resetDeviceContent = (dispatch) => {
    return () => {
        dispatch(Actions.onResetDeviceContent())
    }
}
