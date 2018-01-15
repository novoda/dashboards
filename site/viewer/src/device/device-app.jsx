import React from 'react'
import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { DeviceComponent } from './device-component'

export class DeviceApp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            deviceId: '',
            hasAuthed: false
        }
    }

    render() {
        return (
            this.state.hasAuthed
                ? <DeviceComponent deviceId={this.state.deviceId} />
                : null
        )
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    deviceId: user.uid,
                    hasAuthed: true
                })
            } else {
                firebase.auth()
                    .signInAnonymously()
                    .catch(console.log)
            }
        })
    }

}
