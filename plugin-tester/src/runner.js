const http = require('request-promise-native')
const decache = require('decache')
const fs = require('fs')

//
const _exists = (id) => {
    try {
        fs.accessSync(encodeURIComponent(id) + '.cache')
        return true
    } catch (error) {
        return false
    }
}

const _save = (id, data) => {
    fs.writeFileSync(encodeURIComponent(id) + '.cache', JSON.stringify(data))
}

const _read = (id) => {
    const path = encodeURIComponent(id) + '.cache'
    const data = fs.readFileSync(path)
    return JSON.parse(data)
}

const cache = {
    hasExpired: (id) => !_exists(id),
    save: (id, viewState) => _save(id, viewState),
    read: (id) => new Promise((resolve, reject) => resolve(_read(id)))
}
//

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
                pluginInstanceId: config.pluginInstanceId // config.json no longer maps directly to the configuration object
            }
        }
        decache(path)
        //require(path).plugin()(request, ignoredResponse)
        const dependencies = {
            cache: cache
        }
        require(path).plugin(dependencies)(request, ignoredResponse)
        console.log("Deployed plugin successfully\n")
    } catch (error) {
        console.log("Compile error:\n", error, "\n")
    }
}
