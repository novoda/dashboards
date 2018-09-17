import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './device-use-case'
import { DeviceView } from './device-view'

class Component extends React.Component {

    render() {
        const isEditing = this.props.isEditing
        return (
            <DeviceView
                title={isEditing ? 'Edit device' : 'Add device'}
                submitLabel={isEditing ? 'Save changes' : 'Add device'}
                device={this.props.deviceView}
                onDeviceNameChanged={this._onDeviceNameChanged.bind(this)}
                onDeviceIdChanged={this._onDeviceIdChanged.bind(this)}
                onSubmit={this._onUpdateDevice.bind(this)}
                onTopicChanged={this._onTopicChanged.bind(this)}
                onBack={() => {
                    this.props.history.goBack()
                }} />
        )
    }

    componentWillMount() {
        this.props.initialiseDevice()
    }

    componentDidMount() {
        if (this.props.isEditing) {
            this.props.fetchTopicsWithDevice(this.props.deviceId)
        } else {
            this.props.fetchTopics()
        }
    }

    _onDeviceNameChanged(deviceName) {
        this.props.updateDeviceName(deviceName)
    }

    _onDeviceIdChanged(deviceId) {
        this.props.updateDeviceId(deviceId)
    }

    _onTopicChanged(topicId) {
        this.props.updateSelectedTopic(topicId)
    }

    _onUpdateDevice() {
        this.props.updateDevice(this.props.deviceId, this.props.deviceView)
    }
}

const mapStateToProps = (state, ownProps) => {
    const isEditing = ownProps.type === 'edit'
    const mappedState = { deviceView: state.device, isEditing }
    return isEditing
        ? { ...mappedState, deviceId: ownProps.match.params.deviceId }
        : mappedState
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTopics: UseCase.fetchTopics(dispatch),
        fetchTopicsWithDevice: UseCase.fetchTopicsWithDevice(dispatch),
        updateDeviceId: UseCase.updateId(dispatch),
        updateDeviceName: UseCase.updateName(dispatch),
        updateSelectedTopic: UseCase.updateSelectedTopic(dispatch),
        updateDevice: UseCase.updateDevice,
        initialiseDevice: UseCase.initialiseDevice(dispatch)
    }
}

export const DeviceDetailsComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
