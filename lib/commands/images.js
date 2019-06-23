const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const utils = require('../utils');

exports.command = 'images <input>';
exports.aliases = ['i'];
exports.desc = 'Generate sequence of images.';
exports.builder = {
    output: {
        type: 'string',
        aliases: ['o'],
        describe: 'Folder path to output sequence images.',
        demand: true,
        normalize: true,
    }
};
exports.handler = async (argv) => {
    const { input, output } = argv;

    try {
        utils.checkInput(input);
        await utils.checkOutput(output);
    } catch (e) {
        console.error(chalk.red(e.message));
        process.exit(1);
    }

    const fileData = fs.readFileSync(input, 'utf8');
    const snapshots = utils.exportImagesFromChromeTimeline(fileData);

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