import { createAction } from 'redux-actions'

export const ON_ANONYMOUS_DEVICE_ID = 'ON_ANONYMOUS_DEVICE_ID'
export const onAnonymousDeviceId = createAction(ON_ANONYMOUS_DEVICE_ID)

export const ON_DEVICE_CONTENT = 'ON_DEVICE_CONTENT'
export const onDeviceContent = createAction(ON_DEVICE_CONTENT)

export const ON_DEVICE_CONTENT_ERROR = 'ON_DEVICE_ERROR'
export const onDeviceContentError = createAction(ON_DEVICE_CONTENT_ERROR)

export const ON_RESET_DEVICE_CONTENT = 'ON_RESET_DEVICE_CONTENT'
export const onResetDeviceContent = createAction(ON_RESET_DEVICE_CONTENT)
