#! /usr/bin/env node
const chokidar = require('chokidar');
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path')

const DEFAULT_CONFIG = { port: 5000 }

const args = process.argv.slice(2);
const pluginPath = args[0]
const config = args[1] || DEFAULT_CONFIG

const plugin = require(pluginPath).plugin()

const request = {
    body: {
        type: 'query',
        callbackUrl: `http://localhost:${config.port}/callback`,
        configuration: {}
    }
}

const response = {
    status: (code) => {
        return {
            send: (payload) => {
                // do nothing
            }
        }
    }
}

app.use(bodyParser.json({ limit: '50mb' }));

const IFRAME_STYLE = 'width: 100%; height: 100vh; border: none; position: absolute'

const toHtmlPage = (element) => {
    const HEAD = '<head><meta charset="utf-8"></head>'
    const STYLE = '<style>body { margin: 0; }</style>'
    return `<!doctype html><html lang="en">${HEAD}${STYLE}<body>${element}</body></html>`
}

app.post('/callback', (request, response) => {
    const iframePayload = encodeURIComponent(toHtmlPage(request.body.html))
    const iframe = `<iframe style="${IFRAME_STYLE}" src="data:text/html,${iframePayload}"/>`
    const html = toHtmlPage(`<div id="root">${iframe}</div>`)
    io.emit('update', html)
    response.end()
})

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
    plugin(request, response)
});

http.listen(config.port)

chokidar.watch(args[0], { ignored: /(^|[\/\\])\../ })
    .on('change', path => {
        plugin(request, response)
    })
