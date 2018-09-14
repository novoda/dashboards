import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './topic-use-case'
import { TopicView } from './topic-view'

class Component extends React.Component {

    render() {
        const isEditing = this.props.isEditing
        return (
            <div>
                <TopicView
                    title={isEditing ? 'Edit topic' : 'Add topic'}
                    submitLabel={isEditing ? 'Save changes' : 'Add topic'}
                    pluginInstances={this.props.topicView.pluginInstances}
                    name={this.props.topicView.name}
                    onNameChanged={this._onNameChanged.bind(this)}
                    onSubmit={isEditing ? this._onUpdateTopic.bind(this) : this._onAddTopic.bind(this)}
                    onInstanceToggle={this._onInstanceToggle.bind(this)}
                    onBack={() => {
                        this.props.history.goBack()
                    }} />
            </div>
        )
    }

    componentDidMount() {
        if (this.props.isEditing) {
            this.props.fetchPluginInstancesForTopic(this.props.topicId)
        } else {
            this.props.fetchPluginInstances()
        }
    }

    _onInstanceToggle(id, toggled) {
        this.props.updatePluginInstanceToggle(id, toggled)
    }

    _onNameChanged(name) {
        this.props.updateName(name)
    }

    _onUpdateTopic() {
        this.props.updateTopic(this.props.topicId, this.props.topicView)
    }

    _onAddTopic() {
        this.props.addTopic(this.props.topicView)
    }

}

const mapStateToProps = (state, ownProps) => {
    const isEditing = ownProps.type === 'edit'
    const mappedState = { topicView: state.adminTopic, isEditing }
    return isEditing
        ? { ...mappedState, topicId: ownProps.match.params.topicId }
        : mappedState
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPluginInstancesForTopic: UseCase.fetchPluginInstancesForTopic(dispatch),
        fetchPluginInstances: UseCase.fetchPluginInstances(dispatch),
        addTopic: UseCase.addTopic,
        updateTopic: UseCase.updateTopic,
        updateName: UseCase.updateName(dispatch),
        updatePluginInstanceToggle: UseCase.updatePluginInstanceToggle(dispatch)
    }
}

export const TopicDetailsComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
