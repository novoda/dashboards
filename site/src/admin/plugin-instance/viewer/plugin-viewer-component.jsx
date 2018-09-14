import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './plugin-use-case'
import ContentComponent from '../../../common/viewer/content-component'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

class Component extends React.Component {

    render() {
        return <ContentComponent url={this.props.url} />
    }

    componentDidMount() {
        this.unsubscribe = this.props.startWatchingPluginContent(this.props.id)
    }

    componentWillUnmount() {
        this.props.resetPluginContent()
        this.unsubscribe()
    }

}

const mapStateToProps = (state, ownProps) => {
    const { url } = state.pluginInstanceViewer
    const { instanceId } = ownProps.match.params
    return {
        id: instanceId,
        url
    }
}

const mapDispatchToProps = (dispatch) => {
    const database = firebase.database()
    return {
        startWatchingPluginContent: UseCase.watchPluginContent(dispatch, database),
        resetPluginContent: UseCase.resetPluginContent(dispatch)
    }
}

export const PluginViewerComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
