const fs = require('fs').promises
const path = require('path')
const execa = require('execa')
const { error, warning } = require('./utils')

module.exports = async function(projectPath) {
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
