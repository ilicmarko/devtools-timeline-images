# Devtools Timeline Images

<p align="center">
![npm](https://img.shields.io/npm/v/devtools-timeline-images.svg?style=for-the-badge)
</p>

A really small utility to extract images from Chrome Timeline.

## Setup

```bash
yarn global add devtools-timeline-images
# or NPM
npm i -g devtools-timeline-images
```

## Usage

CLI takes to arguments `-i` and `-o`:
* `-i` or `--input` - Specify the input JSON file.
* `-o` or `--output` - Specify the output folder.

*Note: If the output directory does not exist the CLI will create it.*

## Example

```bash
devtools-timeline-images -i ./example-site.json -o ./images
```

## Save a recoding

![Save recoding](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/save-profile.png)

More information at [Google Developer Docs](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference#save)
