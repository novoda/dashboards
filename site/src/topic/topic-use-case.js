import * as Actions from './topic-actions'
import { watchTopicData } from '../dashboard-repository'
import { loadHtml } from '../common/html-loader'

export const watchTopicContent = (dispatch) => (topicId) => {
    return watchTopicData(topicId, (url) => {
        loadHtml(url).then(html => {
            dispatch(Actions.onTopicContent(html))
        })
    })
}

export const resetTopicContent = (dispatch) => {
    return () => {
        dispatch(Actions.onResetTopicContent())
    }
}
