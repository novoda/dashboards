import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'

const loggerMiddleware = (store) => {
    return next => action => {
        console.log(action);
        return next(action);
    }
}

export const create = () => {
    return createStore(
        reducer,
        applyMiddleware(
            loggerMiddleware
        )
    )
}