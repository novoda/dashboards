const dashboardPlugin = require('./dashboard-plugin')
const templatedPlugin = require('./templated-plugin')
const cache = require('./cache')

const plugin = {
    templated: templatedPlugin(dashboardPlugin),
    cache: (database, id, interval, viewStateProvider) => cache(database, id, interval, viewStateProvider),
    vanilla: dashboardPlugin,
    createStringField: (label) => {
        return {
            label: label,
            type: 'string'
        }
    }
}

module.exports = plugin
