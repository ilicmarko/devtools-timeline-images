#!/usr/bin/env node
const path = require('path');
const yargs = require('yargs');

// noinspection BadExpressionStatementJS
yargs
    .scriptName('dte')
    .usage('$0 <cmd> [args]')
    .commandDir(path.join(__dirname, 'commands'))
    .demandCommand()
    .option('output', {
        alias: 'o',
        describe: 'Output folder where the images will be exported.'
    })
    .demandOption(['output'], 'Please provide output argument.')
    .help('h')
    .alias('h', 'help')
    .argv;