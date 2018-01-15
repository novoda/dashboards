import { readDevices, readPlugins, readTopics, removeDevice } from '../dashboard-repository'
import * as Actions from './home-actions'

export const fetchDevices = (dispatch) => async () => {
    dispatch(Actions.loadDevices())
    const devices = await readDevices()
    dispatch(Actions.devicesLoaded(devices))
}

export const fetchPlugins = (dispatch) => async () => {
    dispatch(Actions.loadPlugins())
    const plugins = await readPlugins()
    dispatch(Actions.pluginsLoaded(plugins))
}

export const fetchTopics = (dispatch) => async () => {
    dispatch(Actions.loadTopics())
    const topics = await readTopics()
    dispatch(Actions.topicsLoaded(topics))
}

export const selectTab = (dispatch) => (position) => {
    dispatch(Actions.selectTab(position))
}

export const deleteDevice = (dispatch) => async (device) => {
    await removeDevice(device.id)
    await fetchDevices(dispatch)()
}
