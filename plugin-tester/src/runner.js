const http = require('request-promise-native')
const decache = require('decache')

const createRequestBody = (port, pluginConfig) => {
    return {
        type: 'query',
        callbackUrl: `http://localhost:${port}/callback`,
        configuration: pluginConfig
    }
}

const localPlugin = (localPath, query) => () => {
    const request = {
        body: query
    }
    const response = {
        status: () => {
            return {
                send: (message) => { }
            }
        }
    }
    decache(localPath);
    return require(localPath).plugin()(request, response)
}

const hostedPlugin = (url, query) => () => {
    const request = {
        url: url,
        body: query,
        json: true
    }
    return http.post(request)
}

module.exports.local = (path, port, pluginConfig) => {
    const query = createRequestBody(port, pluginConfig)
    return localPlugin(path, query)
}
