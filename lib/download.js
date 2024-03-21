const path = require('path')
const download = require('download-git-repo')
const ora = require('ora')
const { info } = require('../lib/utils')

module.exports = function(target, url) {
  target = path.join(target || '.', '')
  return new Promise((resolve, reject) => {
    // const spinner = ora(`正在下载项目模版，源地址：${info(url)}`).start()
    const spinner = ora(`正在下载项目模版...`).start()
    download(`direct:${url}`, target, { clone: true }, (err) => {
      if (err) {
        spinner.fail()
        reject(err)
      } else {
        spinner.succeed()
        resolve(target)
      }
    })
  })
}
