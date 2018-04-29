const dashboardPlugin = require('./dashboard-plugin')
const templatedPlugin = require('./templated-plugin')

const plugin = {
    templated: templatedPlugin(dashboardPlugin),
    vanilla: dashboardPlugin,
    createStringField: (label) => {
        return {
            label: label,
            type: 'string'
        }
    }
}

module.exports = plugin
