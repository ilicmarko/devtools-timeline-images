const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const utils = require('../utils');
const tmp = require('tmp-promise');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

exports.command = 'video <input>';
exports.aliases = ['v'];
exports.desc = 'Generate slowdown video from the timeline export.';
exports.builder = {
    output: {
        type: 'string',
        aliases: ['o'],
        describe: 'Video file name to export.',
        demand: true,
        normalize: true,
    }
};
exports.handler = async (argv) => {
    const { input, output } = argv;

    try {
        utils.checkInput(input);
        await utils.checkOutput(output, true);
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

    let folder = await tmp.dir({ prefix: 'dte_', unsafeCleanup:true });
    convertImages(snapshots, folder.path);
    await merge(folder.path, output);
    tmp.setGracefulCleanup();

    console.log(chalk.green.bold(`Video successfully exported to ${output}`));
    process.exit();
};

function convertImages(images, output) {
    let filePath;
    images.forEach((image, i) => {
        filePath = path.join(output, `${i}.jpg`);
        fs.writeFileSync(filePath, Buffer.from(image, 'base64'));
    });
}

async function merge(input, output) {
    await new Promise((resolve, reject) => {
        ffmpeg()
            .addInput(path.join(input, `%d.jpg`))
            .on('error', err => reject(err))
            .on('end', resolve)
            .noAudio()
            .output(output)
            .outputFPS(30)
            .run();
    });
}