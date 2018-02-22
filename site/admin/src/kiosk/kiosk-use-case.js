import * as Actions from './kiosk-actions'

export const watchAnonymousStateChange = (dispatch, auth) => () => {
    return auth.onAuthStateChanged(user => {
        if (user) {
            dispatch(Actions.onAnonymousDeviceId(user.uid))
        } else {
            auth
                .signInAnonymously()
                .catch(console.log)
        }
    })
}

export const watchDeviceContent = (dispatch, database) => (deviceId) => {
    return database.ref(`/v2/devices_data/${deviceId}`)
        .on('value', snapshot => {
            if (!snapshot.exists()) {
                return
            }
            const url = snapshot.val()
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    dispatch(Actions.onDeviceContent(html))
                })
        })
}

