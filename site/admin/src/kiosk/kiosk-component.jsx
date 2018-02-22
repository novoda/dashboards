import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './kiosk-use-case'
import { KioskView } from './kiosk-view'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

class Component extends React.Component {

    render() {
        if (this.props.deviceId) {
            return <KioskView viewState={this.props} />
        } else {
            return null
        }
    }

    componentDidMount() {
        this.unsubscribeFromAuthStateChanges = this.props.startWatchingAnonymousStateChange()
    }

    componentWillUpdate(nextProps) {
        const previousProps = this.props
        if (nextProps.deviceId && previousProps.deviceId !== nextProps.deviceId) {
            this.unsubscribeFromDeviceChanges = this.props.startWatchingDeviceContent(nextProps.deviceId)
        }
    }

    componentWillUnmount() {
        this.unsubscribeFromAuthStateChanges()
        if (this.unsubscribeFromDeviceChanges) {
            this.unsubscribeFromDeviceChanges()
        }
    }

}

const mapStateToProps = (state, ownProps) => {
    const { deviceId, html } = state.kiosk
    return {
        deviceId,
        isProvisioned: html ? true : false,
        html
    }
}

const mapDispatchToProps = (dispatch) => {
    const auth = firebase.auth()
    const database = firebase.database()
    return {
        startWatchingAnonymousStateChange: UseCase.watchAnonymousStateChange(dispatch, auth),
        startWatchingDeviceContent: UseCase.watchDeviceContent(dispatch, database)
    }
}

export const KioskComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
