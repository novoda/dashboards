import { createAction } from 'redux-actions'

export const ON_LOADING_TOPICS = 'ON_LOADING_TOPICS'
export const loadTopics = createAction(ON_LOADING_TOPICS)

export const ON_TOPICS_LOADED = 'ON_TOPICS_LOADED'
export const topicsLoaded = createAction(ON_TOPICS_LOADED)

export const ON_TOPICS_WITH_DEVICE_LOADED = 'ON_TOPICS_WITH_DEVICE_LOADED'
export const topicsWithDeviceLoaded = createAction(ON_TOPICS_WITH_DEVICE_LOADED)

export const UPDATE_NAME = 'UPDATE_DEVICE_NAME'
export const updateName = createAction(UPDATE_NAME)

export const UPDATE_ID = 'UPDATE_DEVICE_ID'
export const updateId = createAction(UPDATE_ID)

export const UPDATE_SELECTED_TOPIC = 'UPDATE_SELECTED_TOPIC'
export const updateSelectedTopic = createAction(UPDATE_SELECTED_TOPIC)

export const INITIALISE_DEVICE = 'INITIALISE_DEVICE'
export const initialiseDevice = createAction(INITIALISE_DEVICE)
