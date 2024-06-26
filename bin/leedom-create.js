#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const glob = require('glob')
const { program } = require('commander')
const inquirer = require('inquirer')
const { success, error, info, banner, initGitRepo, downloadTemplate, fixDirectoryPath, checkNewVersion } = require('../lib/utils')
const templates = require('../lib/templates')
const { name, version } = require('../package')

program.name('leedom')
  .usage('create <app-name>')
  .description('create a new project powered by Leedom')
  .parse(process.argv)

let timeout = null
const firstParam = program.args[0]

// 开始执行任务
init(firstParam)

// 初始化
async function init(projectName) {
  console.clear()
  console.log(banner(`\n${name} v${version}\n`))

  await checkNewVersion()
  await confirmProjectName(projectName)
}

async function confirmProjectName(projectName) {
  if (!projectName) {
    const { myProject } = await inquirer.prompt([
      {
        name: 'myProject',
        type: 'input',
        message: '请输入您的项目名:',
        default: 'my-project',
      },
    ])
    projectName = myProject
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
      console.log(`当前目录 ${info(fixDirectoryPath(existDirectoryName))} 已经存在，请另起项目名!\n`)
      timeout = setTimeout(() => {
        confirmProjectName()
      }, 2000)
    } else {
      selectStartWay(projectName)
    }
  } else {
    selectStartWay(projectName)
  }
}

// 选择创建项目方式
async function selectStartWay(projectName) {
  clearTimeout(timeout)
  const { operation } = await inquirer.prompt([
    {
      name: 'operation',
      type: 'list',
      message: `请选择操作类型:`,
      choices: templates.operate,
    },
  ])
  if (!operation) {
    return
  } else {
    operation === 'default' ? generateTemplateProject(projectName) : generateCustomRepo(projectName)
  }
}

// 创建自定义仓库地址项目
async function generateCustomRepo(projectName) {
  const { repo } = await inquirer.prompt([
    {
      name: 'repo',
      type: 'input',
      message: '请输入仓库地址:',
      default: 'leedom92/vue-h5-template',
    },
  ])

  if (!repo) {
    return
  } else {
    downloadTemplate(projectName, repo)
      .then(async(target) => {
        const repoDirectory = path.resolve(process.cwd(), path.join('.', target))
        await initGitRepo(repoDirectory)
        console.log('\n项目创建成功，可执行以下命令：\n')
        console.log(success.bold(`  cd ${target}\n`))
        console.log(`请参考 ${success.bold(`${fixDirectoryPath(repoDirectory)}/README.md`)} 启动项目\n`)
        process.exit(0)
      })
      .catch(() => {
        console.log(error('\n项目创建失败，请重试！\n'))
        process.exit(1)
      })
  }
}

// 创建自带模版项目
async function generateTemplateProject(projectName) {
  const { type } = await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: `请选择模版类型:`,
      choices: templates.type,
    },
  ])

  if (!type) {
    return
  } else {
    const { url } = await inquirer.prompt([
      {
        name: 'url',
        type: 'list',
        message: `请选择模版:`,
        choices: templates[type],
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
          process.exit(0)
        })
        .catch(() => {
          console.log(error('\n项目创建失败，请重试！\n'))
          process.exit(1)
        })
    }
  }
}
