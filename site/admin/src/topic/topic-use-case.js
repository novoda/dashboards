import * as Actions from './topic-actions'
import { watchTopicData } from '../dashboard-repository'

export const watchTopicContent = (dispatch) => (topicId) => {
    return watchTopicData(topicId, (url) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                dispatch(Actions.onTopicContent(html))
            })
    })
}

export const resetTopicContent = (dispatch) => {
    return () => {
        dispatch(Actions.onResetTopicContent())
    }
}