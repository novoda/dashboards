import React from 'react'

export const LandingView = ({ viewState }) => {
    if (viewState.loading) {
        return <h1>Loading!</h1>
    } 
    return <div>Hello</div>
}
