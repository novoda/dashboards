#! /usr/bin/env node
const chokidar = require('chokidar');
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path')

const args = require('optimist')
.demand('i', 'Path to module or url to hosted plugin')
.default('p', 5000)
.argv

const DEFAULT_CONFIG = { port: 5000 }

const args = process.argv.slice(2);
const pluginPath = args[0]
const config = args[1] || DEFAULT_CONFIG

app.use(bodyParser.json({ limit: '50mb' }));

const plugin = require(pluginPath).plugin()

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
})

app.post('/callback', (request, response) => {
    const html = createDashboardPayload(request.body.html)
    io.emit('update', html)
    response.end()
})

http.listen(config.port)

io.on('connection', (socket) => {
    requestPluginRedraw()
});

chokidar.watch(args[0], { ignored: /(^|[\/\\])\../ })
    .on('change', path => {
        requestPluginRedraw()
    })

const createDashboardPayload = (htmlInput) => {
    const IFRAME_STYLE = 'width: 100%; height: 100vh; border: none; position: absolute'

    const toHtmlPage = (element) => {
        const HEAD = '<head><meta charset="utf-8"></head>'
        const STYLE = '<style>body { margin: 0; }</style>'
        return `<!doctype html><html lang="en">${HEAD}${STYLE}<body>${element}</body></html>`
    }

    const iframePayload = encodeURIComponent(toHtmlPage(htmlInput))
    const iframe = `<iframe style="${IFRAME_STYLE}" src="data:text/html,${iframePayload}"/>`
    return toHtmlPage(`<div id="root">${iframe}</div>`)
}

const requestPluginRedraw = () => {
    const request = {
        body: {
            type: 'query',
            callbackUrl: `http://localhost:${config.port}/callback`,
            configuration: {}
        }
    }

    const response = {
        status: () => {
            return {
                send: (message) => { }
            }
        }
    }

    plugin(request, response)
}


