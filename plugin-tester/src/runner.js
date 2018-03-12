const http = require('request-promise-native')
const decache = require('decache')

const ignoredResponse = {
    status: () => {
        return {
            send: (message) => { }
        }
    }
}

module.exports.local = (path, port, configReader) => () => {
    const config = configReader()
    const request = {
        body: {
            type: 'query',
            callbackUrl: `http://localhost:${port}/callback`,
            configuration: config
        }
    }
    decache(path)
    return require(path).plugin()(request, ignoredResponse)
}
