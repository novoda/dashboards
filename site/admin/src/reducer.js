import { combineReducers } from 'redux'
import { home } from './admin/home/home-reducer'
import { plugin } from './admin/plugin/plugin-reducer'
import { pluginInstance } from './admin/plugin-instance/plugin-instance-reducer'
import { topic } from './admin/topic/topic-reducer'
import { device } from './admin/device/device-reducer'
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
