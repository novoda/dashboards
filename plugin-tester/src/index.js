#! /usr/bin/env node

const chokidar = require('chokidar');
const Server = require('./server')
const template = require('./template')
const path = require('path')
const fs = require('fs')
const runnerCreator = require('./runner')
const program = require('commander').version('0.0.1')

program.command('init <name> [path]')
    .description('Create an inital barebones plugin')
    .action((name, customPath) => {
        template.createTemplate(name, customPath)
    })

const resolveConfigPath = config => {
    return path.resolve(config)
}

const readJson = path => {
    return JSON.parse(fs.readFileSync(path))
}

const createConfigReader = (pluginPath, fileName, option) => () => {
    const configPath = path.join(pluginPath, fileName)
    if (option) {
        return readJson(resolveConfigPath(option))
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

const createFirebaseDependencies = (firebaseReader) => {
    const serviceAccount = firebaseReader()
    if (Object.keys(serviceAccount).length === 0) {
        return {}
    }

    const admin = require('firebase-admin')
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });

    return {
        database: () => admin.database()
    }
}

const runPlugin = (pluginPath, options) => {
    const port = options.port || 5000
    const configReader = createConfigReader(pluginPath, 'config.json', options.config)
    const firebaseReader = createConfigReader(pluginPath, 'firebase-secrets.json', options.firebase)

    let dependencies = {}
    Object.assign(dependencies, createFirebaseDependencies(firebaseReader))

    const pluginRunner = runnerCreator.local(pluginPath, port, configReader, dependencies)
    const server = new Server(port, pluginRunner)
    server.start()
    if (options.watch) {
        const watch = createWatcher(pluginRunner)
        watch(pluginPath)
        if (options.config) {
            watch(resolveConfigPath(options.config))
        }
    }
}

const pluginIsInPath = pluginPath => {
    try {
        require.resolve(pluginPath)
        return true
    } catch (error) {
        return false
    }
}

program.command('run [path]')
    .description('runs the plugin in a local server')
    .option('-w, --watch', 'watch the source directory for changes')
    .option('-p, --port', 'optional local server port. default 5000')
    .option('-c, --config <path>', 'path to json representation of a configuration')
    .option('-f, --firebase <path>', 'path to firebase service account json file')
    .action((inputPath, options) => {
        const pluginPath = inputPath ? path.resolve(inputPath) : process.cwd()
        if (pluginIsInPath(pluginPath)) {
            runPlugin(pluginPath, options)
        } else {
            console.error(`Plugin ${pluginPath} not found.`)
        }
    })

program.parse(process.argv)
