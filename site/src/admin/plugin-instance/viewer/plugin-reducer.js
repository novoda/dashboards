import { handleActions } from 'redux-actions'
import * as Actions from './plugin-actions'

const initialState = {
    html: undefined
}

export const plugin = handleActions({
    [Actions.ON_PLUGIN_CONTENT]: (state, action) => {
        return { ...state, html: action.payload }
    },
    [Actions.ON_RESET_PLUGIN_CONTENT]: (state, action) => {
        return { ...state, html: undefined }
    }
}, initialState)
