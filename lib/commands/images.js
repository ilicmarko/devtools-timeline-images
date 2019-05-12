const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const utils = require('../utils');
const inquirer = require('inquirer');

exports.command = 'images <input>';
exports.aliases = ['i'];
exports.desc = 'Generate sequence of images.';
exports.builder = {
    output: {
        type: 'string',
        aliases: ['o'],
        describe: 'Path to JSON file generated by Chrome.',
        demand: true,
        normalize: true,
    }
};
exports.handler = async (argv) => {
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
    } else {
        const { overwrite } = await inquirer
            .prompt([{
                name: 'overwrite',
                type: 'confirm',
                message: `Directory \`${output}\` already exists. Do you want to overwrite it?`
            }]);

        if (overwrite) fs.emptyDirSync(output);
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
};