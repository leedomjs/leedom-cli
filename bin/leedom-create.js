#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const { program } = require('commander')
const inquirer = require('inquirer')
const { success, error, info, banner, initGitRepo, downloadTemplate } = require('../lib/utils')
const templates = require('../lib/templates')
const { name, version } = require('../package')

program.name('leedom')
  .usage('create <app-name>')
  .description('create a new project powered by Leedom')
  .parse(process.argv)

// 开始执行任务
init()

// 初始化
async function init() {
  console.clear()
  console.log(banner(`\n${name} v${version}\n`))
  let projectName = program.args[0]
  if (!projectName) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'input',
        message: '请输入您的项目名:',
        default: 'my-project',
      },
    ])
    projectName = action
  }
  checkDuplicateDir(projectName)
}

// 检查项目名是否重复
function checkDuplicateDir(projectName) {
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

// 创建项目
async function generateProject(projectName) {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: `请选择模版类型:`,
      choices: templates.type,
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
      downloadTemplate(projectName, url)
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
