import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './plugin-use-case'
import { PluginView } from './plugin-view'

class Component extends React.Component {
    render() {
        const isEditing = this.props.isEditing
        return (
            <PluginView
                isEditing={isEditing}
                plugin={this.props.plugin}
                onBack={() => {
                    this.props.history.goBack()
                }}
                onUpdateEndpoint={this._onUpdatePluginEndpoint.bind(this)}
                onAddPlugin={this._addPlugin.bind(this)}
                onDeletePluginInstance={(instance) => {
                    this._deletePluginInstance(this.props.plugin, instance)
                }} />
        )
    }

    componentDidMount() {
        this.props.fetchPlugin(this.props.match.params.pluginId)
    }

    _onUpdatePluginEndpoint(endpoint) {
        this.props.updateEndpoint(endpoint)
    }

    _addPlugin() {
        this.props.addPlugin(this.props.plugin.endpoint)
    }

    _deletePluginInstance(plugin, instance) {
        this.props.deletePluginInstance(plugin.id, instance.id)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        plugin: state.plugin,
        isEditing: ownProps.type === 'edit'
    }
}

const mapDispatchToProps = (dispatch) => {
    const fetchPlugin = UseCase.fetchPlugin(dispatch)
    const updateEndpoint = UseCase.updateEndpoint(dispatch)
    const addPlugin = UseCase.addPlugin(dispatch)
    const deletePluginInstance = UseCase.deletePluginInstance(dispatch)
    return {
        fetchPlugin: (id) => fetchPlugin(id),
        updateEndpoint: (endpoint) => updateEndpoint(endpoint),
        addPlugin: (endpoint) => addPlugin(endpoint),
        deletePluginInstance: (pluginId, instanceId) => deletePluginInstance(pluginId, instanceId)
    }
}

export const PluginComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
