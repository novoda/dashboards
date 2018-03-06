import { createAction } from 'redux-actions'

export const ON_TOPIC_CONTENT = 'ON_TOPIC_CONTENT'
export const onTopicContent = createAction(ON_TOPIC_CONTENT)

export const ON_RESET_TOPIC_CONTENT = 'ON_RESET_TOPIC_CONTENT'
export const onResetTopicContent = createAction(ON_RESET_TOPIC_CONTENT)
