const fs = require('fs').promises
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const degit = require('degit')
const ora = require('ora')
const gradient = require('gradient-string')
const inquirer = require('inquirer')
const isOnline = require('is-online')
const { lt } = require('semver')
const { name, version } = require('../package.json')

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

  // 执行git init命令，并将初始分支名设定为main
  try {
    await execa('git', ['init'], { cwd: projectPath })
    await execa('git', ['checkout', '-b', 'main'], { cwd: projectPath })
  } catch {
    console.log(error('\nGit仓库初始化失败'))
  }
}

// 下载项目模版
const downloadTemplate = async function(target, url) {
  target = path.join(target || '.', '')
  const { cache } = await inquirer.prompt([
    {
      name: 'cache',
      type: 'confirm',
      message: '是否开启缓存下载:',
    },
  ])

  return new Promise((resolve, reject) => {
    const spinner = ora(`正在下载项目模版...`).start()
    const emitter = degit(url, {
      cache, // 是否开启缓存下载
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

// 修复在Windows中输出的错误路径 
const fixDirectoryPath = path => path.replaceAll('\\', '/')

// 检测新版本
const checkNewVersion = async () => {
  const spinner = ora()
  const online = await isOnline()
  if(online) {
    const { stdout : latestVersion} = await execa('npm',['view', name, 'version']);

    if (lt(version, latestVersion)) {
      spinner.warn(`最新版本为 ${warning(`v${latestVersion}`)} ，你可以执行 ${success.underline(`npm install -g ${name}`)} 进行升级。`)
      console.log();
    }
  }
}

module.exports = {
  success,
  error,
  warning,
  info,
  banner,
  initGitRepo,
  downloadTemplate,
  fixDirectoryPath,
  checkNewVersion
}
