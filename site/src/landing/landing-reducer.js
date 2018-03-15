import { handleActions } from 'redux-actions'
import * as Actions from './landing-actions'

const initialState = {
    topics: [],
    loading: true
}

export const landing = handleActions({
    [Actions.ON_LOADING_LANDING]: (state, action) => {
        return { ...state, loading: true }
    },
    [Actions.ON_LANDING_LOADED]: (state, action) => {
        return { ...state, topics: action.payload, loading: false }
    }
}, initialState)
