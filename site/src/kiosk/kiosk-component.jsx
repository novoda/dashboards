import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './kiosk-use-case'
import * as Actions from './kiosk-actions'
import { ContentView } from '../common/viewer/content-view'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

class Component extends React.Component {

    render() {
        if (this.props.id) {
            if (this.props.error) {
                return <ErrorView error={this.props.error} />
            } else {
                return <ContentView viewState={this.props} />
            }
        } else {
            return null
        }
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
    const { deviceId, html, error } = state.kiosk
    return {
        id: deviceId,
        isProvisioned: html ? true : false,
        html,
        error
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

const container = {
    background: '#0000aa',
    color: '#ffffff',
    fontFamily: 'Lucida, monospace',
    fontSize: '30pt',
    textAlign: 'center',
    height: '100vh',
    width: '100vw'
}

const code = {
    background: '#fff',
    color: '#0000aa',
    padding: '2px 8px',
    fontWeight: 'bold'
}

const content = {
    paddingLeft: '10vw',
    paddingRight: '10vw',
    fontSize: '15pt',
    wordWrap: 'break-word'
}

const ErrorView = ({ error }) => (
    <div style={container}>
        <div style={{ paddingTop: '10vh' }}>
            <span style={code}>ERROR {error.code}</span>
            <p>
                Plugin failed to provide content.
            </p>
            <p style={content}>{error.cause}</p>
            <p style={content}>
                {error.source.split('?')[0]}
            </p>
            <p>
            </p>
            <p>#dashboards / #g-it</p>
        </div>
    </div>
)

export const KioskComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
