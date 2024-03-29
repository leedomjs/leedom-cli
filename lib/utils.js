const fs = require('fs').promises
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const degit = require('degit')
const ora = require('ora')
const gradient = require('gradient-string')

/**
 * chalk自定义主题
 */
const success = chalk.green
const error = chalk.red
const warning = chalk.yellow
const info = chalk.hex('#409EFF')
const banner = gradient([
  { color: '#42d392', pos: 0 },
  { color: '#42d392', pos: 0.1 },
  { color: '#647eff', pos: 1 },
])

// 初始化仓库git
const initGitRepo = async function(projectPath) {
  // 检查.git目录是否已存在
  const gitPath = path.join(projectPath, '.git')
  if (await fs.access(gitPath).catch(() => null)) {
    console.log(warning('\nGit仓库已存在\n'))
    return
  }

  // 执行git init命令
  try {
    // console.log(info('\n正在初始化Git仓库...'))
    await execa('git', ['init'], { cwd: projectPath })
    // console.log(success('\nGit仓库已初始化'))
  } catch {
    console.log(error('\nGit仓库初始化失败'))
  }
}

// 下载项目模版
const downloadTemplate = function(target, url) {
  target = path.join(target || '.', '')
  return new Promise((resolve, reject) => {
    const spinner = ora(`正在下载项目模版...`).start()
    const emitter = degit(url, {
      cache: false,
      force: true,
      verbose: true,
    })
    emitter.clone(target).then(() => {
      spinner.succeed('项目模版下载完成！')
      resolve(target)
    }).catch((err) => {
      spinner.fail('项目模版下载失败！')
      reject(err)
    })
  })
}

module.exports = {
  success,
  error,
  warning,
  info,
  banner,
  initGitRepo,
  downloadTemplate,
}
