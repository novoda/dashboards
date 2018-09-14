import { handleActions } from 'redux-actions'
import * as Actions from './topic-actions'

const initialState = {
    html: undefined
}

export const topic = handleActions({
    [Actions.ON_TOPIC_CONTENT]: (state, action) => {
        return { ...state, url: action.payload }
    },
    [Actions.ON_RESET_TOPIC_CONTENT]: (state, action) => {
        return { ...state, url: undefined }
    }
}, initialState)
