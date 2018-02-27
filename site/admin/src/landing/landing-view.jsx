import React from 'react'
import { Link } from 'react-router-dom';

export const LandingView = ({ viewState }) => {
    if (viewState.loading) {
        return <h1>Loading!</h1>
    }

    const topicsList = viewState.topics.map(topic => {
        return (
            <Link to={`/topic/${topic.id}`} key={topic.id}><button> {topic.name} </button></Link>
        )
    })

    return <div>{topicsList}</div>
}
