import { handleActions } from 'redux-actions'
import * as Actions from './device-actions'

const initialState = {
    id: '',
    name: '',
    selectedTopicId: '',
    availableTopics: [],
    loading: false,
    originalState: {}
};

export const device = handleActions({
    [Actions.ON_LOADING_TOPICS]: (state, action) => {
        return { ...state, loading: true }
    },
    [Actions.ON_TOPICS_LOADED]: (state, action) => {
        return { ...state, availableTopics: action.payload, loading: false }
    },
    [Actions.ON_TOPICS_WITH_DEVICE_LOADED]: (state, action) => {
        return { ...action.payload, loading: false, originalState: action.payload }
    },
    [Actions.UPDATE_ID]: (state, action) => {
        return { ...state, id: action.payload }
    },
    [Actions.UPDATE_NAME]: (state, action) => {
        return { ...state, name: action.payload }
    },
    [Actions.UPDATE_SELECTED_TOPIC]: (state, action) => {
        return { ...state, selectedTopicId: action.payload }
    },
    [Actions.INITIALISE_DEVICE]: (state, action) => {
        return initialState
    }
}, initialState)
