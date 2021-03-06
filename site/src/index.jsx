import React from 'react'
import ReactDOM from 'react-dom'
import { HomeComponent } from './admin/home/home-component'
import { create } from './store'
import config from './config'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui'
import { PluginComponent } from './admin/plugin/plugin-component'
import { PluginInstanceComponent } from './admin/plugin-instance/plugin-instance-component'
import { TopicComponent as AdminTopicComponent } from './admin/topic/topic-component'
import { DeviceComponent } from './admin/device/device-component'
import { KioskComponent } from './kiosk/kiosk-component'
import { LandingComponent } from './landing/landing-component'
import { TopicComponent } from './topic/topic-component'

document.body.style.padding = 0;
document.body.style.margin = 0;

firebase.initializeApp(config);
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
                                <Route exact path="/" component={LandingComponent} />
                                <Route exact path="/kiosk" component={KioskComponent} />
                                <Route path="/topic/:topicId" component={TopicComponent} />
                                <Route exact path="/admin" component={HomeComponent} />
                                <Route path="/admin/plugins/add" render={(props) => <PluginComponent type='add' {...props} />} />
                                <Route path="/admin/plugins/:pluginId/add" render={(props) => <PluginInstanceComponent type='add' {...props} />} />
                                <Route path="/admin/plugins/:pluginId/:instanceId" render={(props) => <PluginInstanceComponent type='edit' {...props} />} />
                                <Route path="/admin/plugins/:pluginId" render={(props) => <PluginComponent type='edit' {...props} />} />
                                <Route path="/admin/topics/add" render={(props) => <AdminTopicComponent type='add' {...props} />} />
                                <Route path="/admin/topics/:topicId" render={(props) => <AdminTopicComponent type='edit' {...props} />} />
                                <Route path="/admin/devices/add" component={(props) => <DeviceComponent type='add' {...props} />} />
                                <Route path="/admin/devices/:deviceId" component={(props) => <DeviceComponent type='edit' {...props} />} />
                            </Switch>
                        </BrowserRouter>
                    </MuiThemeProvider>
                </Provider>
            )
        } else {
            return (
                <Provider store={store}>
                    <MuiThemeProvider>
                        <BrowserRouter>
                            <Switch>
                                <Route exact path="/" component={AuthComponent} />
                                <Route exact path="/kiosk" component={KioskComponent} />
                                <Route path="/*" component={AuthComponent} />
                            </Switch>
                        </BrowserRouter>
                    </MuiThemeProvider>
                </Provider>
            )
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                isAuthed: Boolean(user) && !user.isAnonymous
            })
        })
    }

}

const onSignInClicked = () => () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
}

const AuthComponent = ({ }) => {
    return (
        <button onClick={onSignInClicked()}> Sign in</button>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
