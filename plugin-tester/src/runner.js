const http = require('request-promise-native')
const decache = require('decache')
const firebaseCache = require('./firebase-cache')

const REFRESH_INTERVAL = (60 * 1000) * 30

const dependencies = {
    cache: firebaseCache(REFRESH_INTERVAL)
}

const ignoredResponse = {
    status: () => {
        return {
            send: (message) => { }
        }
    }
}

module.exports.local = (pluginPath, port, configReader) => () => {
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
        decache(pluginPath)
        const plugin = require(pluginPath).plugin(dependencies)
        plugin(request, ignoredResponse)
        console.log("Deployed plugin successfully\n")
    } catch (error) {
        console.log("Compile error:\n", error, "\n")
    }
}
