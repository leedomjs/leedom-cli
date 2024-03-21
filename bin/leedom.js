#!/usr/bin/env node

const { program } = require('commander')
const { name, version } = require('../package')

program.version(`${name} v${version}`)
  .usage('<command> [options]')
  .command('create', '<app-name>')
  .parse(process.args)
