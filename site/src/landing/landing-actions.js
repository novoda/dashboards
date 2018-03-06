import { createAction } from 'redux-actions'

export const ON_LOADING_LANDING = 'ON_LOADING_LANDING'
export const loadLanding = createAction(ON_LOADING_LANDING)

export const ON_LANDING_LOADED = 'ON_LANDING_LOADED'
export const landingLoaded = createAction(ON_LANDING_LOADED)
