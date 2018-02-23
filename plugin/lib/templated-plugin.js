const Mustache = require('mustache')
const Inliner = require('inliner');
const fs = require('fs')
const path = require('path')
const utf8 = require('utf8')

const render = (component, viewStateProvider) => (configuration) => {
    const directory = { __dirname: component.__dirname }
    if (viewStateProvider) {
        return viewStateProvider(configuration).then((viewState) => {
            const state = Object.assign(viewState || {}, directory)
            return renderComponent(component, state)
        })
    } else {
        return renderComponent(component, directory)
    }
}

const renderComponent = (component, state) => {
    const template = fs.readFileSync(path.join(component.__dirname, component.template), 'utf8')
    const injectedHtml = Mustache.render(template, state)
    return inline(injectedHtml)
}

const inline = (html) => {
    return new Promise((resolve, reject) => {
        new Inliner(html, { images: false, encoding: 'utf-8' }, (error, outputHtml) => {
            error ? reject(error) : resolve(outputHtml)
        })
    })
}

module.exports = (plugin) => (configuration, component, viewStateProvider) => {
    return plugin(configuration, render(component, viewStateProvider))
}
