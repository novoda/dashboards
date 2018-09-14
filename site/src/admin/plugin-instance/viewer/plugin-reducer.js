import { handleActions } from 'redux-actions'
import * as Actions from './plugin-actions'

const initialState = {
    url: undefined
}

export const plugin = handleActions({
    [Actions.ON_PLUGIN_CONTENT]: (state, action) => {
        return { ...state, url: action.payload }
    },
    [Actions.ON_RESET_PLUGIN_CONTENT]: (state, action) => {
        return { ...state, url: undefined }
    }
}, initialState)
