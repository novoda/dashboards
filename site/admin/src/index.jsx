import React from 'react'
import ReactDOM from 'react-dom'
import { HomeComponent } from './home/home-component'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { create } from './store'
import config from './config'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui'
import { PluginComponent } from './plugin/plugin-component'
import { PluginInstanceComponent } from './plugin-instance/plugin-instance-component'
import { TopicComponent } from './topic/topic-component'
import { DeviceComponent } from './device/device-component'

firebase.initializeApp(config);
injectTapEventPlugin();
const store = create();

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isAuthed: false
        }
    }

    render() {
        if (this.state.isAuthed) {
            return (
                <Provider store={store}>
                    <MuiThemeProvider>
                        <BrowserRouter>
                            <Switch>
                                <Route exact path="/admin/" component={HomeComponent} />
                                <Route path="/admin/plugins/add" render={(props) => <PluginComponent type='add' {...props} />} />                                
                                <Route path="/admin/plugins/:pluginId/add" render={(props) => <PluginInstanceComponent type='add' {...props} />} />
                                <Route path="/admin/plugins/:pluginId/:instanceId" render={(props) => <PluginInstanceComponent type='edit' {...props} />} />
                                <Route path="/admin/plugins/:pluginId" render={(props) => <PluginComponent type='edit' {...props} />} />
                                <Route path="/admin/topics/add" render={(props) => <TopicComponent type='add' {...props} />} />
                                <Route path="/admin/topics/:topicId" render={(props) => <TopicComponent type='edit' {...props} />} />
                                <Route path="/admin/devices/add" component={(props) => <DeviceComponent type='add' {...props} />} />
                                <Route path="/admin/devices/:deviceId" component={(props) => <DeviceComponent type='edit' {...props} />} />
                            </Switch>
                        </BrowserRouter>
                    </MuiThemeProvider>
                </Provider>
            )
        } else {
            return (
                <button onClick={this._onSignInClicked.bind(this)}> Sign in</button>
            )
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                isAuthed: Boolean(user)
            })
        })
    }

    _onSignInClicked() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
