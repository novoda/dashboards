#! /usr/bin/env node

const chokidar = require('chokidar');
const Server = require('./server')
const runnerCreator = require('./runner')

const program = require('commander')
program.version('0.0.1')
    .command('local <path>')
    .option('-w', '--watch', 'Watch the source directory for changes')
    .option('-p', '--port', 'Port')
    .action((path, options) => {
        const port = options.port || 5000
        const pluginRunner = runnerCreator.local(path, port, {})        
        const server = new Server(port, pluginRunner)
        server.start()
        if (options.watch) {
            chokidar
                .watch(path, { ignored: /(^|[\/\\])\../ })
                .on('change', pluginRunner)
        }
    })

program.parse(process.argv)
