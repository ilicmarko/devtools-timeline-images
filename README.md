<p align="center"><img src="https://marko.ilic.ninja/dte.svg" alt="logo" width="450"></p>

<h1 align="center">Devtools Timeline Exporter</h1>

<p align="center">
    <a href="https://www.npmjs.com/package/devtools-timeline-images"><img alt="npm" src="https://img.shields.io/npm/v/devtools-timeline-images.svg"></a>
</p>

A really small utility to extract images from Chrome Timeline.

## Installation

```bash
yarn global add devtools-timeline-images
# or NPM
npm i -g devtools-timeline-images
```

## Usage

As of v2 CLI includes and alias for the name, `dte` (Devtools Timeline Export). This has been changed as in the future
there is a plan to export videos, not only images.

### Image

```bash
dte images <input> [options]

Generate sequence of images.

Options:
  --version     Show version number                                    [boolean]
  --output, -o  Path to JSON file generated by Chrome.       [string] [required]
  -h, --help    Show help                                              [boolean]
```

Also you can generate images with an alias `i`, like this: `dte i <input> [options]`.

## Options
- `-o` or `--output` - Specify the output folder.

*Note: If the output directory does not exist the CLI will create it.*

## Example

```bash
dte i ./example-site.json -o ./images
```

## Save a recoding

![Save recoding](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/save-profile.png)

More information at [Google Developer Docs](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference#save)
