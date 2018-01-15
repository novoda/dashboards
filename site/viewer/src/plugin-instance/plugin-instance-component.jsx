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
        return <PluginInstanceView
            html={this.state.html}
            deviceId={this.props.deviceId}
            onLogoClicked={this._onLogoClicked.bind(this)} />
    }

    componentDidMount() {
        const id = this.props.instanceId
        firebase.database().ref(`/v2/plugin_instances_data/${id}`)
            .on('value', snapshot => {
                const url = snapshot.val()
                fetch(url).then(response => response.text()).then(html => {
                    this.setState({
                        html: html
                    })
                })
            })
    }

    _onLogoClicked() {
        this.props.history.push("?novoda=true");
    }
}

const PluginInstanceView = ({ html, deviceId, onLogoClicked }) => {
    return Boolean(html)
        ? <IframeView key={html} html={html} />
        : <UnprovisionedView deviceId={deviceId} onLogoClicked={onLogoClicked} />
}

export const PluginInstanceComponent = Component
