#! /usr/bin/env node

const chokidar = require('chokidar');
const Server = require('./server')
const runnerCreator = require('./runner')
const template = require('./template')
const path = require('path')
const fs = require('fs')

const program = require('commander').version('0.0.1')

program.command('init <name>')
    .description('Create an inital barebone plugin')
    .action(name => {
        template.createTemplate(name)
    })

const readConfig = (pluginPath, options) => {
    const configPath = path.join(pluginPath, 'config.json')
    if (options.config) {
        delete require.cache[path.resolve(options.config)]
        return require(path.resolve(options.config))        
    } else if (fs.existsSync(configPath)) {
        delete require.cache[configPath]
        return require(configPath)
    } else {
        return {}
    }
}

const createPluginRunner = (pluginPath, options) => {
    const port = options.port || 5000
    const config = readConfig(pluginPath, options)
    return runnerCreator.local(pluginPath, port, config) 
}

const runPlugin = (pluginPath, options) => {
    const port = options.port || 5000
    const pluginRunner = createPluginRunner(pluginPath, options)
    const server = new Server(port, pluginRunner)
    server.start()
    if (options.watch) {
        chokidar
            .watch(pluginPath, { ignored: /(^|[\/\\])\../ })
            .on('change', () => {
                createPluginRunner(pluginPath, options)()
            })
    }
}

program.command('run [path]')
    .description('runs the plugin in a local server')
    .option('-w, --watch', 'watch the source directory for changes')
    .option('-p --port', 'optional local server port. default 5000')
    .option('-c --config <path>', 'path to json representation of a configuration')
    .action((inputPath, options) => {
        const pluginPath = inputPath ? path.resolve(inputPath) : process.cwd()
        runPlugin(pluginPath, options)
    })

program.parse(process.argv)
