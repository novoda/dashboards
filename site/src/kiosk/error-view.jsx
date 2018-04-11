import React from 'react'

const container = {
    background: '#0000aa',
    color: '#ffffff',
    fontFamily: 'Lucida, monospace',
    fontSize: '30pt',
    textAlign: 'center',
    height: '100vh',
    width: '100vw'
}

const code = {
    background: '#fff',
    color: '#0000aa',
    padding: '2px 8px',
    fontWeight: 'bold'
}

const content = {
    paddingLeft: '10vw',
    paddingRight: '10vw',
    fontSize: '15pt',
    wordWrap: 'break-word'
}

export default ({ error }) => (
    <div style={container}>
        <div style={{ paddingTop: '10vh' }}>
            <span style={code}>ERROR {error.code}</span>
            <p>
                Plugin failed to provide content.
            </p>
            <p style={content}>{error.cause}</p>
            <p style={content}>
                {error.source.split('?')[0]}
            </p>
            <p>
            </p>
            <p>Report to your dashboard administrator if the problem persists</p>
        </div>
    </div>
)
