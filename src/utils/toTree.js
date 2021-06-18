import _ from 'lodash'

/**
 *
 * @param {Array} flatList
 * @param {String} [parentKey]
 * @param {String} [sort]
 * @param id
 * @returns {Array}
 */
export default function (flatList, parentKey = 'pid', sort, id = 'id') {
  flatList = _.cloneDeep(flatList)
  if (sort) flatList = _.sortBy(flatList, sort)
  const object = _.keyBy(flatList, id)
  flatList.forEach(e => {
    if (e[parentKey] && e[parentKey] !== '0') {
      const parent = object[e[parentKey]]
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(e)
      } else {
        e[parentKey] = null
      }
    }
  })
  const treeData = _.reject(flatList, e => e[parentKey] && e[parentKey] !== '0')
  calculateAncestors(treeData)
  return treeData
}

// 计算每个节点的祖先id列表并添加到obj上
function calculateAncestors(treeData) {
  c(treeData)
}
function c(list, parent) {
  _.forEach(list, e => {
    if (parent) {
      e.ancestorIds = (parent.ancestorIds || []).concat(parent.id)
    }
    if (e.children) {
      c(e.children, e)
    }
  })
}
