#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const utils = require('./utils');
const argv = require('minimist')(process.argv.slice(2), {
    string: ['input', 'output'],
    alias: { i: 'input', o: 'output' },
});

if (!argv.hasOwnProperty('i')) {
    console.error(chalk.red('`--input` or `-i` argument required'));
    process.exit(1);
}

if (!argv.hasOwnProperty('o')) {
    console.error(chalk.red('`--output` or `-o` argument required'));
    process.exit(1);
}
const { input, output } = argv;

if (!fs.existsSync(input)) {
    console.error(chalk.red(`Provided file '${input}' doesn't exist`));
    process.exit(1);
}

if (!fs.existsSync(output)) {
    try {
        fs.mkdirSync(output);
        console.log(chalk.blue(`Directory ${output} created!`));
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Error(`EACCES: permission denied, mkdir '${output}'`);
        }

        throw err;
    }
}

const fileData = fs.readFileSync(input, 'utf8');
let jsonData;

try {
    jsonData = JSON.parse(fileData);
} catch (e) {
    console.error(chalk.red(e));
    process.exit(1)
}

if (!Array.isArray(jsonData)) {
    console.log('This doesn\'t look like Chrome Timeline JSON. Please provide valid data.');
    process.exit(1);
}

const snapshots = jsonData.filter(item => item.name === 'Screenshot').map(item => item.args.snapshot);

if (!snapshots.length) {
    console.error(chalk.red('There are no captured frames inside the provided input.'));
    process.exit(1);
}

let imageStream;
let ext;

snapshots.forEach((snapshot, i) => {
    imageStream = Buffer.from(snapshot, 'base64');
    ext = utils.getFileTypeFromStream(imageStream);
    if (ext) {
        fs.writeFileSync(path.resolve(output, `${i}.${ext}`), imageStream);
    } else {
        console.log(chalk.yellow(`Frame ${i} couldn't be saved.`))
    }
});

console.log(chalk.green.bold(`${snapshots.length} frames exported to ${output}`));
process.exit();