/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-19 14:41:10
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-03-19 14:45:11
 * @Desc 全局过滤器
 */

// 时间截取年月日
export const formatData = str => {
  if (!str) {
    return ''
  }
  return str.substring(0, 10)
}
// 万元过滤
export const wan = (value, mantissa) => {
  if (mantissa || mantissa === 0) {
    return _.isNumber(value) ? _.round(value / 10000, mantissa) : 0
  } else {
    let result = _.isNumber(value) ? _.round(value / 10000, 0) : 0
    if (result === 0) {
      result = _.isNumber(value) ? _.round(value / 10000, 2) : 0
    }
    return result
  }
}
export const ymd = date => {
  return date ? moment(date).format('YYYY-MM-DD') : '-'
}
