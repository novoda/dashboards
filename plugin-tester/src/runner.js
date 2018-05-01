const http = require('request-promise-native')
const decache = require('decache')

const ignoredResponse = {
    status: () => {
        return {
            send: (message) => { }
        }
    }
}

module.exports.local = (pluginPath, port, configReader, dependencies) => () => {
    try {
        const config = configReader()
        const request = {
            body: {
                type: 'query',
                callbackUrl: `http://localhost:${port}/callback`,
                configuration: config,
                meta: { id: 'plugin-tester' }
            }
        }
        decache(pluginPath)
        require(pluginPath).plugin(dependencies)(request, ignoredResponse)
        console.log("Deployed plugin successfully\n")
    } catch (error) {
        console.log("Compile error:\n", error, "\n")
    }
}
