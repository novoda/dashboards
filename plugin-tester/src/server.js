const express = require('express')
const app = express()
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path')

module.exports = class {

    constructor(port, onRequestRedraw) {
        const app = express()
        this.server = http.Server(app);
        this.io = socketIo(this.server);
        this.port = port

        app.use(bodyParser.json({ limit: '50mb' }));

        app.get('/', (request, response) => {
            response.sendFile(path.join(__dirname, 'index.html'))
        })

        app.post('/callback', (request, response) => {
            response.end()
            this.updateHtml(this._createDashboardPayload(request.body.html))
        })

        this.io.on('connection', (socket) => {
            onRequestRedraw()
        })
    }

    _createDashboardPayload(htmlInput) {
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

    start() {
        this.server.listen(this.port)
    }

    updateHtml(html) {
        this.io.emit('update', html)
    }

}


