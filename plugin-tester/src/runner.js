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
    try {
        const config = configReader()
        const request = {
            body: {
                type: 'query',
                callbackUrl: `http://localhost:${port}/callback`,
                configuration: config
            }
        }
        decache(path)
        require(path).plugin()(request, ignoredResponse)
        console.log("Deployed plugin successfully\n")
    } catch (error) {
        console.log("Compile error:\n", error, "\n")
    }
}
