import React from 'react'

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

export const IframeView = ({ html }) => (
    <object
        data={`data:text/html,${encodeURIComponent(toHtmlPage(html))}`}
        style={frameStyle}
        ref={(iframe) => { this.iframe = iframe; }} />
)
