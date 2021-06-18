/**
 任务名称：2747/ 自定义表单：表单分类、表单功能开发
 开发人员：李建敏
 日期：2020-3月-27日
 任务类型：2.复制代码
 **/
import toTree from '@/utils/toTree'
import toFlat from '@/utils/toFlat'
import _ from 'lodash'

export default function (flatList, fn) {
  const treeData = toTree(flatList)
  const flatData = toFlat(treeData)
  const dict = _.keyBy(flatData, 'id')
  const allowItemList = flatData.filter(e => fn(e))
  const result = _.chain(allowItemList)
    .map(e => e.ancestorIds)
    .flatten()
    .union()
    .map(id => dict[id])
    .concat(allowItemList)
    .compact()
    .unionBy('id')
    .value()
  return toTree(result)
}
