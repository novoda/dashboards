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

export const watch = (path) => (callback) => {
    const onData = snapshot => {
        if (!snapshot.exists()) return
        callback(snapshot.val())
    }
    firebase.database().ref(`v2/${path}`)
    .on('value', onData)
    return () => {
        firebase.database().ref(`v2/${path}`)
        .off('value', onData)    
    }
}

