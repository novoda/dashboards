import { combineReducers } from 'redux'
import { home } from './admin/home/home-reducer'
import { plugin } from './admin/plugin/plugin-reducer'
import { pluginInstance } from './admin/plugin-instance/plugin-instance-reducer'
import { plugin as pluginInstanceViewer } from './admin/plugin-instance/viewer/plugin-reducer'
import { topic as adminTopic } from './admin/topic/topic-reducer'
import { device } from './admin/device/device-reducer'
import { kiosk } from './kiosk/kiosk-reducer'
import { landing } from './landing/landing-reducer'
import { topic } from './topic/topic-reducer'

const reducer = combineReducers({
    home,
    plugin,
    pluginInstance,
    pluginInstanceViewer,
    adminTopic,
    device,
    kiosk,
    landing,
    topic
})

export default reducer
