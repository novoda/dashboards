import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './plugin-instance-use-case'
import { PluginInstanceView } from './plugin-instance-view'

class Component extends React.Component {

    render() {
        const { isEditing, instanceView } = this.props
        return (
            <PluginInstanceView
                title={isEditing ? 'Edit instance' : 'Add instance'}
                submitLabel={isEditing ? 'Save changes' : 'Add instance'}
                instanceView={instanceView}
                onConfigurationChanged={this._onConfigurationChanged.bind(this)}
                onNameChanged={this._onNameChanged.bind(this)}
                onBack={this._onBack.bind(this)}
                onSubmit={isEditing ? this._onUpdateInstance.bind(this) : this._onAddInstance.bind(this)}
            />
        )
    }

    _onConfigurationChanged(id, value) {
        this.props.updateConfiguration(id, value)
    }

    _onNameChanged(name) {
        this.props.updateInstanceName(name)
    }

    _onBack() {
        this.props.history.goBack()
    }

    _onAddInstance() {
        this.props.addInstance(this.props.instanceView)
    }

    _onUpdateInstance() {
        const { pluginId, instanceId } = this.props
        this.props.updateInstance(pluginId, instanceId, this.props.instanceView)
    }

    componentDidMount() {
        const { pluginId, instanceId } = this.props
        if (this.props.isEditing) {
            this.props.fetchPluginInstance(pluginId, instanceId)
        } else {
            this.props.fetchPlugin(pluginId)
        }
    }

}

const mapStateToProps = (state, ownProps) => {
    const isEditing = ownProps.type === 'edit'
    const mappedState = { instanceView: state.pluginInstance, pluginId: ownProps.match.params.pluginId, isEditing }
    return isEditing
        ? { ...mappedState, instanceId: ownProps.match.params.instanceId }
        : mappedState
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPlugin: UseCase.fetchPlugin(dispatch),
        fetchPluginInstance: UseCase.fetchPluginInstance(dispatch),
        addInstance: UseCase.addInstance,
        updateInstance: UseCase.updateInstance,
        updateConfiguration: UseCase.updateConfiguration(dispatch),
        updateInstanceName: UseCase.updateInstanceName(dispatch)
    }
}

export const PluginInstanceComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
