#! /usr/bin/env node

const chokidar = require('chokidar');
const Server = require('./server')
const runnerCreator = require('./runner')
const path = require('path')

const program = require('commander')
program.version('0.0.1')
    .command('local <path>')
    .option('-w', '--watch', 'Watch the source directory for changes')
    .option('-p', '--port', 'Port')
    .action((inputPath, options) => {
        const port = options.port || 5000
        const absolutePath = path.resolve(inputPath)
        const pluginRunner = runnerCreator.local(absolutePath, port, {})        
        const server = new Server(port, pluginRunner)
        server.start()
        if (options.watch) {
            chokidar
                .watch(absolutePath, { ignored: /(^|[\/\\])\../ })
                .on('change', pluginRunner)
        }
    })

program.parse(process.argv)
