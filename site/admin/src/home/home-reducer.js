import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import * as Actions from './home-actions'

const devicesInitialState = {
    devices: [],
    loading: false
};

const devices = handleActions({
    [Actions.ON_LOADING_DEVICES]: (state, action) => {
        return { ...state, loading: true }
    },
    [Actions.ON_DEVICES_LOADED]: (state, action) => {
        return { devices: action.payload, loading: false }
    }
}, devicesInitialState)

const pluginsInitialState = {
    plugins: [],
    loading: false
};

const plugins = handleActions({
    [Actions.ON_LOADING_PLUGINS]: (state, action) => {
        return { ...state, loading: true }
    },
    [Actions.ON_PLUGINS_LOADED]: (state, action) => {
        return { plugins: action.payload, loading: false }
    }
}, pluginsInitialState)

const topicsInitialState = {
    topics: [],
    loading: false
};

const topics = handleActions({
    [Actions.ON_LOADING_TOPICS]: (state, action) => {
        return { ...state, loading: true }
    },
    [Actions.ON_TOPICS_LOADED]: (state, action) => {
        return { topics: action.payload, loading: false }
    }
}, topicsInitialState)

const homeInitialState = {
    tabSelection: 0
}

const state = handleActions({
    [Actions.ON_UPDATE_HOME_TAB_SELECTION]: (state, action) => {
        return { ...state, tabSelection: action.payload }
    }
}, topicsInitialState)

export const home = combineReducers({
    devices,
    plugins,
    topics,
    state
})
