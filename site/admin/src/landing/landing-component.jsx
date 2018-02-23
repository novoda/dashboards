import React from 'react'
import { connect } from 'react-redux'
import * as UseCase from './landing-use-case'
import { LandingView } from './landing-view'

class Component extends React.Component {

    render() {
        return <LandingView viewState={this.props} />
    }

    componentDidMount() {
        this.props.fetchLanding()
    }

}

const mapStateToProps = (state, ownProps) => {
    const { topics, loading } = state.landing
    return {
        topics,
        loading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchLanding: UseCase.fetchLanding(dispatch),
    }
}

export const LandingComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
