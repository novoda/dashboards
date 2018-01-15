import * as firebase from 'firebase/app'
import 'firebase/database'

export const read = (path) => {
    return firebase.database().ref(`v2/${path}`)
        .once('value')
        .then(snapshot => {
            return snapshot.val()
        })
}

export const push = (path) => (payload) => {
    return firebase.database().ref(`v2/${path}`)
        .push(payload)
}

export const set = (path) => (payload) => {
    return firebase.database().ref(`v2/${path}`)
        .set(payload)
}

export const remove = (path) => () => {
    return firebase.database().ref(`v2/${path}`)
        .remove()
}

