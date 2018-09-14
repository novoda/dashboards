import React from 'react'
import { ContentView } from './content-view'
import { loadHtml } from '../html-loader'
import ErrorView from './error-view'
import UnprovisionedView from './unprovisioned-view'

export default class ContentComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isProvisioned: props.url ? true : false,
            html: undefined,
            error: undefined
        }
    }

    render() {
        if (!this.state.isProvisioned && this.props.id) {
            return <UnprovisionedView id={this.props.id} />
        } else if (this.state.error) {
            return <ErrorView error={this.state.error} />
        } else if (this.props.url && this.state.html) {
            return <ContentView html={this.state.html} />
        } else {
            return null
        }
    }

    componentWillUpdate(nextProps) {
        const previousProps = this.props
        if (nextProps.url && previousProps.url !== nextProps.url) {
            this.setState((state) => {
                return { ...state, isProvisioned: nextProps.url ? true : false }
            })

            loadHtml(nextProps.url)
                .then(result => {
                    this.setState({
                        html: result,
                        error: undefined
                    })
                })
                .catch(error => {
                    this.setState({
                        error: error,
                        html: false
                    })
                })
        }
    }
}
