const chalk = require('chalk')
const gradient = require('gradient-string')

module.exports = {
  /**
   * chalk自定义主题
   */
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.hex('#409EFF'),
  banner: gradient([
    { color: '#42d392', pos: 0 },
    { color: '#42d392', pos: 0.1 },
    { color: '#647eff', pos: 1 },
  ]),
}
