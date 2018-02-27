import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './plugin-instance-use-case'
import { PluginInstanceDetailsComponent as DetailsComponent } from './plugin-instance-details-component'
import { PluginViewerComponent as ViewerComponent } from './viewer/plugin-viewer-component'

export class PluginInstanceComponent extends React.Component {

    render() {
        const { isEditing, instanceView } = this.props
        return (
            <div>
                <DetailsComponent {...this.props} />
                <ViewerComponent {...this.props} />
            </div>
        )
    }
}