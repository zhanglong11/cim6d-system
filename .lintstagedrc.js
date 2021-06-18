/**
 任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
 开发人员：李建敏
 日期：2020-3月-17日
 任务类型：1、全新代码
 **/
const { CLIEngine } = require('eslint')

const cli = new CLIEngine({})

module.exports = {
  'src/**/*.{js,vue}': files =>
    [
      'eslint --fix --max-warnings=0 ' + files.filter(file => !cli.isPathIgnored(file)).join(' '),
      'git add']
}
