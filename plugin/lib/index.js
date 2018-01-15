const dashboardPlugin = require('./dashboard-plugin')

const plugin = {
    templated: require('./templated-plugin')(dashboardPlugin),
    vanilla: dashboardPlugin,
    createStringField: (label) => {
        return {
            label: label,
            type: 'string'
        }
    }
}

module.exports = plugin 
