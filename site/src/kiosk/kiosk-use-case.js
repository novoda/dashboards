import * as Actions from './kiosk-actions'
import { watchDeviceData } from '../dashboard-repository'

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
        dispatch(Actions.onDeviceContent(url))
    })
}
export const resetDeviceContent = (dispatch) => {
    return () => {
        dispatch(Actions.onResetDeviceContent())
    }
}
