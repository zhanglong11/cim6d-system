<!--
 * @Description: 文件列表带下载
 * @Version:
 * @Autor:
 * @Date: 2020-02-20 15:04:15
 * @LastEditTime: 2020-02-21 11:00:58

@bug名称: 1181/下载附件-下载的文件名是乱码
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，添加根据文件id下载文件接口，文件下载方法修改，修改比例(20%)
 -->
<template>
  <div>
    <ul v-if="list.length > 0">
      <li v-for="(item, index) in list" :key="index">
        <span class="fileName">{{ item.fileName }}</span>
        <el-button type="text" @click="downLoad(item)">下载</el-button>
      </li>
    </ul>
    <!--
                /**
                 任务名称：BUG#1379 物资与设备管理-材料管理-所有的查看页面-下载附件-下载的文件名是乱码
                 开发人员：崔洛宜
                 日期：2020-03-31
                 BUG类型：测试人员发现的研发自测未通过引起的BUG
                 **/
            -->
    <ul v-else>
      <li style="padding-top: 6px;">
        无附件
      </li>
    </ul>
  </div>
</template>

<script>
import api from '@/api/file'
export default {
  props: {
    // 文件id集合
    ids: {}
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    ids: {
      handler: function (n, e) {
        if (n) {
          this.getFileList()
        }
      },
      immediate: true
    }
  },
  methods: {
    async getFileList() {
      let arr = this.ids ? this.ids.split(',') : []
      let res = await api.getFileList(arr)
      this.list = res.data
    },
    downLoad(item) {
      //console.log(item)
      /*const a = document.createElement('a')
      a.href = item.fileUrl
      a.download = item.fileName
      a.click()*/
      api.downloadFileById(item.id).then(res => {
        //console.log(res)
        let blobUrl = window.URL.createObjectURL(res.data)
        const aElement = document.createElement('a')
        aElement.href = blobUrl
        aElement.download = item.fileName
        aElement.click()
        window.URL.revokeObjectURL(blobUrl)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.fileName {
  padding-right: 10px;
}
</style>
