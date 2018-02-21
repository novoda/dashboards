import React from 'react'
import { UnprovisionedView } from '../device/unprovisioned/unprovisioned-view'
import { IframeView } from '../device/iframe-view'
import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

class Component extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            html: ''
        }
    }

    render() {
        return <TopicView
            html={this.state.html}
            deviceId={this.props.deviceId}
            onLogoClicked={this._onLogoClicked.bind(this)} />
    }

    componentDidMount() {
        const id = this.props.topicId
        firebase.database().ref(`/v2/topics_index/${id}/current_index`)
            .on('value', snapshot => {
                if (!snapshot.exists()) {
                    return
                }
                const index = snapshot.val()
                firebase.database().ref(`/v2/topics_data/${id}`)
                    .once('value')
                    .then(snapshot => snapshot.val())
                    .then(instances => {
                        const instanceKey = Object.keys(instances)[index]
                        return instances[instanceKey].html
                    })
                    .then(url => {
                        fetch(url).then(response => response.text()).then(html => {
                            this.setState({
                                html: html
                            })
                        })
                    })
            })
    }

    _onLogoClicked() {
        this.props.history.push("?novoda=true");
    }
}

const TopicView = ({ html, deviceId, onLogoClicked }) => {
    return Boolean(html)
        ? <IframeView key={html} html={html} />
        : <UnprovisionedView deviceId={deviceId} onLogoClicked={onLogoClicked} />
}

export const TopicComponent = Component
