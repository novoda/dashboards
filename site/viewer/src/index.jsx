import React from 'react'
import ReactDOM from 'react-dom'
import config from './config'
import * as firebase from 'firebase/app'
import * as qs from 'query-string'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { NovodaApp } from './novoda/novoda-app'
import { DeviceApp } from './device/device-app'

firebase.initializeApp(config);

document.body.style.margin = 0
document.body.style.backgroundColor = '#26A3DB'

class App extends React.Component {

    render() {
        const isNovoda = qs.parse(this.props.location.search).novoda === 'true'
        return isNovoda ? <NovodaApp /> : <DeviceApp />
    }

}

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App} />
        </Switch>
    </BrowserRouter>
    , document.getElementById('root')
);

