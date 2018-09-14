import React from 'react'
import { TopicComponent as ViewerComponent } from '../../topic/topic-component'
import { TopicDetailsComponent as DetailsComponent } from './topic-details-component'

export class TopicComponent extends React.Component {
   
    shouldComponentUpdate() {
        return false
    }
    
    render() {
        return (
            <div>
                <DetailsComponent {...this.props} />
                <ViewerComponent {...this.props} />
            </div>
        )
    }
}
