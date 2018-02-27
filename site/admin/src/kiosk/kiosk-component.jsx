import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './kiosk-use-case'
import { KioskView } from '../viewer/kiosk-view'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

class Component extends React.Component {

    render() {
        if (this.props.id) {
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
        if (nextProps.id && previousProps.id !== nextProps.id) {
            this.unsubscribeFromDeviceChanges = this.props.startWatchingDeviceContent(nextProps.id)
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
        id: deviceId,
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
