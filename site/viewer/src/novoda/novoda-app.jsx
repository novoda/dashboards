import React from 'react'
import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { NovodaView } from './novoda-view'

export class NovodaApp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            devices: [],
            pluginInstances: [],
            hasAuthed: false,
            selection: null
        }
    }

    render() {
        return <NovodaView
            hasAuthed={this.state.hasAuthed}
            selection={this.state.selection}
            onSignIn={this._signIn.bind(this)}
            onSelect={this._selectId.bind(this)}
            devices={this.state.devices}
            pluginInstances={this.state.pluginInstances}
        />
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const db = firebase.database()
                const readDevices = db.ref(`/v2/devices/`)
                    .once('value')
                    .then(snapshot => {
                        const value = snapshot.val()
                        return Object.keys(value).map(key => {
                            const device = value[key]
                            return {
                                id: key,
                                name: device.name
                            }
                        })
                    })
                const readPluginInstances = db.ref('/v2/plugin_instances')
                    .once('value')
                    .then(snapshot => {
                        const value = snapshot.val()
                        return Object.keys(value).map(key => {
                            const plugin = value[key]
                            return Object.keys(plugin).map(instanceKey => {
                                const instance = plugin[instanceKey]
                                return {
                                    name: instance.name,
                                    id: instanceKey
                                }
                            })
                        }).reduce((acc, curr) => {
                            return acc.concat(curr)
                        }, [])
                    })

                Promise.all([readDevices, readPluginInstances])
                    .then(result => {
                        this.setState({
                            devices: result[0],
                            pluginInstances: result[1],
                            hasAuthed: true
                        })
                    })
            }
        })
    }

    _signIn() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
    }

    _selectId(id, type) {
        this.setState({
            selection: {
                id,
                type
            }
        })
    }

}
