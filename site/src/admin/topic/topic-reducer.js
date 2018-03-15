import { handleActions } from 'redux-actions'
import * as Actions from './topic-actions'

const initialState = {
    name: '',
    pluginInstances: [],
    loading: false
};

export const topic = handleActions({
    [Actions.ON_LOADING_PLUGIN_INSTANCES]: (state, action) => {
        return { ...state, loading: true }
    },
    [Actions.ON_PLUGIN_INSTANCES_LOADED]: (state, action) => {
        return { pluginInstances: action.payload, loading: false }
    },
    [Actions.UPDATE_NAME]: (state, action) => {
        return { ...state, name: action.payload }
    },
    [Actions.UPDATE_PLUGIN_INSTANCE_TOGGLE]: (state, action) => {
        const instances = state.pluginInstances.map(instance => {
            return action.payload.id === instance.id
                ? { ...instance, isToggled: action.payload.isToggled }
                : instance
        })
        return { ...state, pluginInstances: instances }
    }
}, initialState)
