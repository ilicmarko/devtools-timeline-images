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

module.exports = {
    getFileTypeFromStream,
};