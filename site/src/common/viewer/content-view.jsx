import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import * as style from './style.css'

export const ContentView = ({ html }) => {
    return <Animate><IframeView key={html} html={html} /></Animate>
}

const Animate = ({ children }) => {
    return (
        <ReactCSSTransitionGroup
            transitionName="content"
            transitionEnter={true}
            transitionLeave={true}
            transitionEnterTimeout={1500}
            transitionLeaveTimeout={1500}>
            {children}
        </ReactCSSTransitionGroup>
    )
}

const frameStyle = {
    width: '100%',
    height: '100vh',
    border: 'none',
    position: 'absolute'
}

const toHtmlPage = (element) => {
    const HEAD = '<head><meta charset="utf-8"></head>'
    const STYLE = '<style>body { margin: 0; }</style>'
    return `<!doctype html><html>${HEAD}${STYLE}<body>${element}</body></html>`
}

const IframeView = ({ html }) => (
    <object
        data={`data:text/html,${encodeURIComponent(toHtmlPage(html))}`}
        style={frameStyle}
        ref={(iframe) => { this.iframe = iframe; }} />
)

