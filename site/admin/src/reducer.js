import { combineReducers } from 'redux'
import { home } from './home/home-reducer'
import { plugin } from './plugin/plugin-reducer'
import { pluginInstance } from './plugin-instance/plugin-instance-reducer'
import { topic } from './topic/topic-reducer'
import { device } from './device/device-reducer'
import { kiosk } from './kiosk/kiosk-reducer'
import { landing } from './landing/landing-reducer'

const reducer = combineReducers({
    home,
    plugin,
    pluginInstance,
    topic,
    device,
    kiosk,
    landing
})

export default reducer
