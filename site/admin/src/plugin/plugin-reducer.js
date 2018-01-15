import { handleActions } from 'redux-actions'
import * as Actions from './plugin-actions'

const initialState = {
    id: '',
    name: '',
    instances: [],
    endpoint: ''
}

export const plugin = handleActions({
    [Actions.ON_PLUGIN_LOADED]: (state, action) => {
        const {plugin, instances} = action.payload
        return {...state, id: plugin.id, name: plugin.name, instances: instances}
    },
    [Actions.ON_PLUGIN_ENDPOINT_UPDATED]: (state, action) => {
        return {...state, endpoint: action.payload}
    }
}, initialState)
