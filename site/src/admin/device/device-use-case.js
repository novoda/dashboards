import { readTopics, setDevice, setDeviceTopic, readDevice, removeDevice, removeDeviceTopic } from '../../dashboard-repository'
import * as Actions from './device-actions'

export const fetchTopics = (dispatch) => async () => {
    dispatch(Actions.loadTopics())
    const topics = await readTopics()
    dispatch(Actions.topicsLoaded(topics))
}

export const fetchTopicsWithDevice = (dispatch) => async (deviceId) => {
    dispatch(Actions.loadTopics())
    const topics = await readTopics()
    const device = await readDevice(deviceId)
    const payload = {
        id: device.id,
        selectedTopicId: device.topicId,
        name: device.name,
        availableTopics: topics
    }
    dispatch(Actions.topicsWithDeviceLoaded(payload))
}

export const updateDevice = async (device) => {
    const devicePayload = {
        name: device.name,
        topic_id: device.selectedTopicId
    }

    const previousId = device.originalState.id
    if (isDifferent(previousId, device.id)) {
        await removeDevice(previousId)
    }
    const previousTopic = device.originalState.selectedTopicId
    if (isDifferent(previousTopic, device.selectedTopicId)) {
        await removeDeviceTopic(previousTopic, previousId)
    }
    await setDevice(device.id)(devicePayload)
    await setDeviceTopic(device.selectedTopicId, device.id)
}

const isDifferent = (a, b) => (a !== undefined && a !== b)

export const updateName = (dispatch) => (name) => {
    dispatch(Actions.updateName(name))
}

export const updateId = (dispatch) => (id) => {
    dispatch(Actions.updateId(id))
}

export const updateSelectedTopic = (dispatch) => (topicId) => {
    dispatch(Actions.updateSelectedTopic(topicId))
}

export const initialiseDevice = (dispatch) => () => {
    dispatch(Actions.initialiseDevice())
}
