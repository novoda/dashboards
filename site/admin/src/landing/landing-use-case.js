import * as Actions from './landing-actions'
import { readTopics } from '../dashboard-repository'

export const fetchLanding = (dispatch) => async () => {
    dispatch(Actions.loadLanding())
    const topics = await readTopics()
    dispatch(Actions.landingLoaded(topics))
}