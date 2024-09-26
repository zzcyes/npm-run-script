# scriptz-cli (nrs)

English | [简体中文](./README.zh-cn.md)

![demo](./demo.png)

NPM Script Runner is a command-line tool for visualizing and running scripts from package.json. It provides an interactive interface that makes finding and executing npm scripts easier.

## Features

- Visualize scripts from package.json
- Interactive script selection and execution
- Support for script searching
- Record recently run scripts
- Advanced mode for selecting different project paths

## Installation

Global installation:

```bash
npm install -g npm-run-script
```

Or local installation in a project:

```bash
npm install --save-dev npm-run-script
```

## Usage

### Basic Usage

```bash
nrs
```

This will display help information and available commands.

### List and Select Scripts to Run

```bash
nrs -l
```

### Advanced Mode: Select Project Path and Run Scripts

```bash
nrs -la
```

### Search and Run Matching Scripts

```bash
nrs -s <keyword>
```

### Run Recently Used Script

```bash
nrs -r
```

### Run the nth Recently Used Script

```bash
nrs -r --<n>
```

For example, to run the 2nd most recently used script:

```bash
nrs -r --2
```

### List Recently Used Scripts

```bash
nrs -rl
```

### List All Available Scripts

```bash
nrs --list-all
```

## Contributing

Contributions are welcome, including code contributions, issue reports, or improvement suggestions. Please visit our GitHub repository: [npm-run-script](https://github.com/your-username/npm-run-script)

## License

MIT
