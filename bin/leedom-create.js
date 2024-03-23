#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const { program } = require('commander')
const inquirer = require('inquirer')
const download = require('../lib/download')
const initGitRepo = require('../lib/initGitRepo')
const { success, error, info } = require('../lib/utils')
const templates = require('../lib/templates')
const { name, version } = require('../package')

program.name('leedom')
  .usage('create <app-name>')
  .description('create a new project powered by Leedom')
  .parse(process.argv)

// 开始执行任务
init()

// 初始化
function init() {
  const projectName = program.args[0]
  if (!projectName) {
    console.log(error('\n请输入项目名\n'))
    program.help()
  } else {
    const list = glob.sync('*') // 遍历当前目录

    if (list.length) { // 当前目录不为空
      // 判断是否有重名文件件
      const hasDuplicateNameDir = list.filter((name) => {
        const fileName = path.resolve(process.cwd(), path.join('.', name))
        const isDir = fs.statSync(fileName).isDirectory()
        return name === projectName && isDir
      })

      if (hasDuplicateNameDir.length) {
        const existDirectoryName = path.resolve(process.cwd(), path.join('.', hasDuplicateNameDir[0]))
        console.log(`当前目录 ${info(existDirectoryName)} 已经存在，请另起项目名!`)
      } else {
        generateProject(projectName)
      }
    } else {
      generateProject(projectName)
    }
  }
}

// 创建项目
async function generateProject(projectName) {
  console.log(info(`${name} v${version}\n`))
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: `请选择模版类型:`,
      choices: [
        { name: '移动端', value: 'mobile' },
        { name: 'PC端', value: 'pc' },
        { name: '取消', value: false },
      ],
    },
  ])

  if (!action) {
    return
  } else {
    const { action: url } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `请选择模版:`,
        choices: templates[action],
      },
    ])

    if (!url) {
      return
    } else {
      download(projectName, url)
        .then(async(target) => {
          const repoDirectory = path.resolve(process.cwd(), path.join('.', target))
          await initGitRepo(repoDirectory)
          console.log('\n项目创建成功，可执行以下命令：\n')
          console.log(success.bold(`  cd ${target}\n  pnpm install\n  pnpm dev\n`))
        })
        .catch(() => {
          console.log(error('\n项目创建失败，请重试！'))
        })
    }
  }
}
