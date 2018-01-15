import { combineReducers } from 'redux'
import { home } from './home/home-reducer'
import { plugin } from './plugin/plugin-reducer'
import { pluginInstance } from './plugin-instance/plugin-instance-reducer'
import { topic } from './topic/topic-reducer'
import { device } from './device/device-reducer'

const reducer = combineReducers({
    home,
    plugin,
    pluginInstance,
    topic,
    device
})

export default reducer
