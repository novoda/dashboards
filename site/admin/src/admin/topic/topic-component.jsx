import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './topic-use-case'
import { TopicView } from './topic-view'
import { TopicComponent as ViewerComponent } from '../../topic/topic-component'
import { TopicDetailsComponent as DetailsComponent } from './topic-details-component'

export class TopicComponent extends React.Component {

    render() {
        return (
            <div>
                <DetailsComponent {...this.props} />
                <ViewerComponent {...this.props} />
            </div>
        )
    }
}