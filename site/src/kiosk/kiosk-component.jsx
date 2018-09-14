import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './kiosk-use-case'
import * as Actions from './kiosk-actions'
import ContentComponent from '../common/viewer/content-component'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

class Component extends React.Component {

    render() {
        return <ContentComponent url={this.props.url} id={this.props.id} />
    }

    componentDidMount() {
        if (this.props.forcedId) {
            this.props.forceId(this.props.forcedId)
        } else {
            this.unsubscribeFromAuthStateChanges = this.props.startWatchingAnonymousStateChange()
        }
    }

    componentWillUpdate(nextProps) {
        const previousProps = this.props
        if (nextProps.id && previousProps.id !== nextProps.id) {
            this.unsubscribeFromDeviceChanges = this.props.startWatchingDeviceContent(nextProps.id)
        }
    }

    componentWillUnmount() {
        this.props.resetDeviceContent()
        if (this.unsubscribeFromAuthStateChanges) {
            this.unsubscribeFromAuthStateChanges()
        }
        if (this.unsubscribeFromDeviceChanges) {
            this.unsubscribeFromDeviceChanges()
        }
    }

}

const mapStateToProps = (state, ownProps) => {
    const { deviceId, url } = state.kiosk
    return {
        id: deviceId,
        url
    }
}

const mapDispatchToProps = (dispatch) => {
    const auth = firebase.auth()
    const database = firebase.database()
    return {
        forceId: (forcedId) => dispatch(Actions.onAnonymousDeviceId(forcedId)),
        startWatchingAnonymousStateChange: UseCase.watchAnonymousStateChange(dispatch, auth),
        startWatchingDeviceContent: UseCase.watchDeviceContent(dispatch, database),
        resetDeviceContent: UseCase.resetDeviceContent(dispatch)
    }
}

export const KioskComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
