/**
 任务名称：2689/ 基础服务-用户管理（react->vue）迁移
 开发人员：李建敏
 日期：2020-3月-25日
 任务类型：2.复制代码
 **/
import { MessageBox } from 'element-ui'
/**
 *
 * @param {Array} rows 选中行
 * @param {String} actionText 要进行的动作
 * @returns {Promise}
 */
export default (rows, actionText = '删除') => {
  const content = rows
    .slice(0, 3)
    .map(e => e.name || e.title || e.label || e.realName)
    .map(text => `<span style='color:red;padding:4px;'>${text}</span>`)
  const length = rows.length > 3 ? `等${rows.length}项吗` : `吗`
  const msg = `<p><span>确定要${actionText}</span>${content}${length} ？</>`
  return MessageBox.confirm(msg, actionText, { dangerouslyUseHTMLString: true, type: 'warning' })
}
