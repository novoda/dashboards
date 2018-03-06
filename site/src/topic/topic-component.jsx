import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './topic-use-case'
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
        this.unsubscribe = this.props.startWatchingTopicContent(this.props.id)
    }

    componentWillUnmount() {
        this.props.resetTopicContent()
        this.unsubscribe()
    }

}

const mapStateToProps = (state, ownProps) => {
    const { html } = state.topic
    const { topicId } = ownProps.match.params
    return {
        id: topicId,
        isProvisioned: html ? true : false,
        html
    }
}

const mapDispatchToProps = (dispatch) => {
    const database = firebase.database()
    return {
        startWatchingTopicContent: UseCase.watchTopicContent(dispatch, database),
        resetTopicContent: UseCase.resetTopicContent(dispatch)
    }
}

export const TopicComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
