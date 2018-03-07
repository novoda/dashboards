import React from 'react'
import { Link } from 'react-router-dom';
import { ContentView, AddFabView } from '../common/common-views'

const toContent = (topic) => {
    return {
        id: topic.id,
        title: topic.name,
        subtitle: topic.id
    }
}

export const LandingView = ({ viewState }) => {
    if (viewState.loading) {
        return (
            <h1>Loading!</h1>
        );
    } else {
        return (
            <div>
                <ContentView
                    content={viewState.topics.map(toContent)}
                    clickThrough="/topic" />
            </div>
        );
    }
}
