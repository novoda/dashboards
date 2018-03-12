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

const resolveConfigPath = config => {
    return path.resolve(config)
}

const readJson = path => {
    return JSON.parse(fs.readFileSync(path))
}

const createConfigReader = (pluginPath, options) => () => {
    const configPath = path.join(pluginPath, 'config.json')
    if (options.config) {
        return readJson(resolveConfigPath(options.config))
    } else if (fs.existsSync(configPath)) {
        return readJson(configPath)
    } else {
        return {}
    }
}

const createWatcher = onChange => location => {
    chokidar
        .watch(location, { ignored: /(^|[\/\\])\../ })
        .on('change', onChange)
}

const runPlugin = (pluginPath, options) => {
    const port = options.port || 5000
    const configReader = createConfigReader(pluginPath, options)
    const pluginRunner = runnerCreator.local(pluginPath, port, configReader)
    const server = new Server(port, pluginRunner)
    server.start()
    if (options.watch) {
        const watch = createWatcher(pluginRunner)
        watch(pluginPath)
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
