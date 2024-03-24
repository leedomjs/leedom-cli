#!/usr/bin/env node

const { program } = require('commander')
const { name, version } = require('../package')
const { banner } = require('../lib/utils')

program.version(banner(`\n${name} v${version}\n`))
  .usage('<command> [options]')
  .command('create', '<app-name>')
  .parse(process.args)
