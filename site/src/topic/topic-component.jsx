import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './topic-use-case'
import ContentComponent from '../common/viewer/content-component'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

class Component extends React.Component {

    render() {
        return <ContentComponent url={this.props.url} />
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
    const { url } = state.topic
    const { topicId } = ownProps.match.params
    return {
        id: topicId,
        url
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
