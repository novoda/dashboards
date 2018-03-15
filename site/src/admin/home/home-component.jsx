import React from 'react'
import { HomeView } from './home-view'
import { connect } from 'react-redux'
import * as UseCase from './home-use-case'

class Component extends React.Component {
    render() {
        return (
            <HomeView
                onTabChanged={(value) => { this.props.selectTab(value) }}
                tabSelection={this.props.state.tabSelection}
                pluginsView={this.props.pluginsView}
                topicsView={this.props.topicsView}
                devicesView={this.props.devicesView}
                onDeletePlugin={this._onDeletePlugin.bind(this)}
                onDeleteTopic={this._onDeleteTopic.bind(this)}
                onDeleteDevice={this._onDeleteDevice.bind(this)}
            />
        )
    }

    componentDidMount() {
        this.props.fetchDevices()
        this.props.fetchPlugins()
        this.props.fetchTopics()
    }

    _onDeleteDevice(device) {
        this.props.deleteDevice(device)
    }

    _onDeleteTopic(topic) {
        this.props.deleteTopic(topic)        
    }

    _onDeletePlugin(plugin) {
        this.props.deletePlugin(plugin)
    }
}

const mapStateToProps = (state) => {
    return {
        devicesView: state.home.devices,
        pluginsView: state.home.plugins,
        topicsView: state.home.topics,
        state: state.home.state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchDevices: UseCase.fetchDevices(dispatch),
        fetchPlugins: UseCase.fetchPlugins(dispatch),
        fetchTopics: UseCase.fetchTopics(dispatch),
        selectTab: UseCase.selectTab(dispatch),
        deleteDevice: UseCase.deleteDevice(dispatch),
        deleteTopic: UseCase.deleteTopic(dispatch),
        deletePlugin: UseCase.deletePlugin(dispatch)
    }
}

export const HomeComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
