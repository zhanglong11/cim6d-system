import http from '@/utils/request'
export const fileApi = {
  // 文件列表查询 @author sunboqiang
  getFileList: data => {
    return http.file({
      url: '/file/manage/list',
      method: 'post',
      data
    })
  },
  // 文件上传
  uploadFile: data => {
    return http.file(
      {
        url: '/file/commonFile/upload',
        method: 'post',
        data
      },
      {
        'Content-Type': 'multipart/form-data'
      }
    )
  },
  // 根据id下载文件
  downloadFileById: id => {
    return http.file({
      url: `/file/commonFile/download/${id}`,
      method: 'get'
    })
  }
}
