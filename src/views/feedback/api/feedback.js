/*
  任务名称：匿名留言功能开发
  开发人员：耿为刚
  日期：2020-07-13
*/
import http from '@/utils/request'
export const feedbackApi = {
  // 添加匿名评论 @author yangjiaqi
  addCommentAnonymous: data => {
    return http.system.post('/noToken/anonymous/comment/add', data)
  },
  // 匿名评论分页列表查询 @author yangjiaqi
  queryCommentListAnonymous: data => {
    return http.system.post('/anonymous/comment/list', data)
  },
  // 匿名评论详情查询 @author yangjiaqi
  getCommentAnonymous: id => {
    return http.system.get(`/anonymous/comment/get/${id}`)
  },
  // 匿名评论文件上传 @author yangjiaqi
  uploadFile: (companyId, data, config) => {
    return http.file.post(`/noToken/file/commonFile/visitor/upload/${companyId}`, data, config)
  },
  // 系统文件在线预览接口
  getFileUrl: id => {
    return http.file.get(`/file/commonFile/download/${id}`)
  },
  // 文件列表查询 @author sunboqiang
  queryFileList: data => {
    return http.file.post('/file/manage/list', data)
  }
}
