import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './device-use-case'
import { KioskComponent as ViewerComponent } from '../../kiosk/kiosk-component'
import { DeviceDetailsComponent as DetailsComponent } from './device-details-component'

export class DeviceComponent extends React.Component {

    shouldComponentUpdate() {
        return false
    }

    render() {
        const isEditing = this.props.isEditing
        return (
            <div>
                <DetailsComponent {...this.props} />
                <ViewerComponent forcedId={this.props.match.params.deviceId} {...this.props} />
            </div>
        )
    }
}