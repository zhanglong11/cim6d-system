import pca from '@/lib/pca.json'
import treeForEach from './treeForEach'
const pcaHash = {}
treeForEach(pca, e => {
  pcaHash[e.value] = e.label
})
/** *
 * @description 获取省市区code对应的名称
 * @param {String} code
 * @return {String} name
 */
export default function (code) {
  return pcaHash[code]
}
