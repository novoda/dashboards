const http = require('request-promise-native')
const decache = require('decache')
const cache = require('./local-cache')
const fbcache = require('./firebase-cache')

const dependencies = {
    cache: fbcache(60 * 1000 * 30)
}

const ignoredResponse = {
    status: () => {
        return {
            send: (message) => { }
        }
    }
}

module.exports.local = (path, port, configReader) => () => {
    try {
        const config = configReader()
        const request = {
            body: {
                type: 'query',
                callbackUrl: `http://localhost:${port}/callback`,
                configuration: config,
                pluginInstanceId: config.pluginInstanceId
            }
        }
        decache(path)
        const plugin = require(path).plugin(dependencies)
        plugin(request, ignoredResponse)
        console.log("Deployed plugin successfully\n")
    } catch (error) {
        console.log("Compile error:\n", error, "\n")
    }
}
