import { handleActions } from 'redux-actions'
import * as Actions from './kiosk-actions'

const initialState = {
    deviceId: undefined,
    html: undefined
}

export const kiosk = handleActions({
    [Actions.ON_ANONYMOUS_DEVICE_ID]: (state, action) => {
        return { ...state, deviceId: action.payload }
    },
    [Actions.ON_DEVICE_CONTENT]: (state, action) => {
        return { ...state, html: action.payload }
    },
    [Actions.ON_RESET_DEVICE_CONTENT]: (state, action) => {
        return { ...state, html: undefined }
    }
}, initialState)
