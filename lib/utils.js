const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');

/**
 * Check Buffer for file signature.
 * @param {Array} header
 * @param {ArrayBuffer} stream
 * @param {Object} [settings]
 * @returns {boolean}
 */
function checkHeader(header, stream, settings) {
    // Basic early checks if the stream is a Buffer
    if (!(stream instanceof Uint8Array || stream instanceof ArrayBuffer || Buffer.isBuffer(stream))) throw new Error('Buffer not valid');
    const buffer = stream instanceof Uint8Array ? stream : new Uint8Array(input);
    if (!(buffer && buffer.length > 1)) throw new Error('Buffer not valid');

    const defaultSettings = { offset: 0 };
    const mergedSettings = { ...defaultSettings, ...settings };

    for (let i = 0; i < header.length; i++) {
        if (header[i] !== buffer[i + mergedSettings.offset]) {
            return false;
        }
    }
    return true;
}

function getFileTypeFromStream(stream) {
    if (checkHeader([0xFF, 0xD8, 0xFF], stream)) return 'jpg';
    if (checkHeader([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], stream)) return 'png';
    if (checkHeader([0x57, 0x45, 0x42, 0x50], stream, {offset: 8})) return 'webp';
    return false;
}

/**
 * Check if provided input is valid.
 * @param {string} input Path to the JSON file.
 * @returns {boolean}
 */
function checkInput(input) {
    if (!fs.existsSync(input)) {
        throw new Error(`Provided file '${input}' doesn't exist`);
    }
    return true;
}

/**
 * Check if the provided output is valid. Output can be a folder or a file based on the command.
 * @param {string} output
 * @param {boolean} [isFile=false] If the output is a file or directory
 * @returns {Promise<boolean>}
 */
async function checkOutput(output, isFile = false) {
    if (isFile) {
        if (path.extname(output) === '') throw new Error(`Provided output '${output}' is not a file`);
        if (!fs.existsSync(path.dirname(output))) throw new Error(`Provided output path '${path.dirname(output)}' doesn't exist`);
        return true;
    }

    if (fs.existsSync(output)) {
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
    return true;
}

/**
 * Return all screenshots from Chrome Timeline JSON file.
 * @param {string} data
 * @returns {string[]} Array of base64 strings.
 */
function exportImagesFromChromeTimeline(data) {
    let jsonData;

    try {
        jsonData = JSON.parse(data);
    } catch (e) {
        console.error(chalk.red(e));
        process.exit(1)
    }

    if (!Array.isArray(jsonData)) {
        console.log('This doesn\'t look like Chrome Timeline JSON. Please provide valid data.');
        process.exit(1);
    }

    return jsonData.filter(item => item.name === 'Screenshot').map(item => item.args.snapshot);
}

module.exports = {
    getFileTypeFromStream,
    checkInput,
    checkOutput,
    exportImagesFromChromeTimeline,
};