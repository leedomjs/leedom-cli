#!/usr/bin/env node

const { program } = require('commander')
const { name, version } = require('../package')

program.version(`${name} ${version}`)
  .usage('<command> [options]')
  .command('create', '<app-name>')
  .parse(process.args)
