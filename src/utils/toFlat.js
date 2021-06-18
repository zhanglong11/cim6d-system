/**
 任务名称：2689/ 基础服务-用户管理（react->vue）迁移
 开发人员：李建敏
 日期：2020-3月-25日
 任务类型：2.复制代码
 **/
/**
 *
 * @param {Array} treeList
 * @param {String} [parentKey]
 * @returns {Array}
 */
export default function (treeList, parentKey = 'pid') {
  treeList = _.cloneDeep(treeList)
  const result = []
  c(treeList)
  function c(list, parent) {
    _.forEach(list, (item, index) => {
      item[parentKey] = null
      result.push(_.assign(item, { [parentKey]: _.get(parent, 'id') }))
      if (item.children) c(item.children, item)
    })
  }
  result.forEach(e => _.unset(e, 'children'))
  return result
}
