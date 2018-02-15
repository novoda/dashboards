const plugin = require('dashboard-plugin')
const generateViewState = require('./data-source')

const component = {
    template: 'template.html',
    __dirname
}

const configuration = () => {
    return {
        "{{pluginId}}": {
            name: '{{pluginName}}',
            template: {
                foo: plugin.createStringField('Foo name for admin panel'),
                bar: plugin.createStringField('Bar name for admin panel')
            }
        }
    }
}

module.exports = plugin.templated(configuration, component, generateViewState)
