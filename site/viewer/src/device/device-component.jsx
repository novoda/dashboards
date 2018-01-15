import React from 'react'
import { UnprovisionedView } from './unprovisioned/unprovisioned-view'
import { IframeView } from './iframe-view'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { withRouter } from "react-router-dom"
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
        return <DeviceView
            html={this.state.html}
            deviceId={this.props.deviceId}
            onLogoClicked={this._onLogoClicked.bind(this)} />
    }

    componentDidMount() {
        const deviceId = this.props.deviceId
        firebase.database().ref(`/v2/devices_data/${deviceId}`)
            .on('value', snapshot => {
                if (!snapshot.exists()) {
                    return
                }
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

const DeviceView = ({ html, deviceId, onLogoClicked }) => {
    return Boolean(html)
        ? <Animate><IframeView key={html} html={html} /></Animate>
        : <UnprovisionedView deviceId={deviceId} onLogoClicked={onLogoClicked} />
}

const Animate = ({ children }) => {
    return (
        <ReactCSSTransitionGroup
            transitionName="content"
            transitionEnter={true}
            transitionLeave={true}>
            {children}
        </ReactCSSTransitionGroup>
    )
}

export const DeviceComponent = withRouter(Component)
