import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './plugin-use-case'
import { KioskView } from '../../../viewer/kiosk-view'

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
        this.unsubscribe = this.props.startWatchingPluginContent(this.props.id)
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

}

const mapStateToProps = (state, ownProps) => {
    const { html } = state.pluginInstanceViewer
    const { instanceId } = ownProps.match.params
    return {
        id: instanceId,
        isProvisioned: html ? true : false,
        html
    }
}

const mapDispatchToProps = (dispatch) => {
    const database = firebase.database()
    return {
        startWatchingPluginContent: UseCase.watchPluginContent(dispatch, database)
    }
}

export const PluginViewerComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
