import React from 'react'

export const LandingView = ({ viewState }) => {
    if (viewState.loading) {
        return <h1>Loading!</h1>
    }

    const topicsList = viewState.topics.map(topic => {
        return (
            <button onClick={() => console.log(topic)}>{topic.name}</button>
        )
    })

    return <div>{topicsList}</div>
}
