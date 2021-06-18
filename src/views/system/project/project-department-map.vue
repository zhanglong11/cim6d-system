<template>
  <div class="container">
    <el-button icon="el-icon-download" @click="exportMinder">项目机构图下载</el-button>
    <div id="minder-container" />
    <div class="footer">
      <div class="submit">
        <el-button @click="handleReturn">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/views/system/api/department'
import treeForEach from '@/utils/treeForEach'
import kity from 'kity'
import kityminder from 'kityminder-core'
import toTree from '@/utils/toTree'
export default {
  name: 'SystemProjectDepartmentMap',
  components: {},
  data() {
    return {
      projectId: this.$route.query.projectId || '', // 项目id
      kity,
      kityminder,
      departmentList: [],
      mindData: [],
      km: null
    }
  },
  mounted() {
    this.getData()
    this.initMinder()
  },
  methods: {
    initMinder() {
      this.km = new window.kityminder.Minder({
        renderTo: '#minder-container'
      })
    },
    // 项目组织架构图
    async getData() {
      const result = await Api.getChartProjectOrgan(this.projectId)
      const datas = result.data
      console.log(result)
      const organList = datas.organList || []
      const participantList = datas.participantList || []
      const newOrganList = toTree(organList, 'pid')
      const newParticipantList = toTree(participantList, 'pid')
      treeForEach(newOrganList, e => {
        e.data = { text: e.title, children: e.children }
      })
      treeForEach(newParticipantList, e => {
        e.data = { text: e.title, children: e.children }
      })
      this.km.importJson({
        root: {
          data: {
            // 'text': localStorage.getItem('companyName')
            text: this.$route.query.projectName
          },
          children: [
            { data: { text: '项目部' }, children: newOrganList },
            { data: { text: '项目参与方' }, children: newParticipantList }
          ]
        },
        template: 'default'
      })
      this.km.execCommand('Hand')
    },
    async exportMinder() {
      const data = await this.km.exportData('png')
      this.download(data)
    },
    download(data) {
      const blob = new Blob([data])
      const fileName = '项目机构图.png'
      if ('download' in document.createElement('a')) {
        // 不是IE浏览器
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = data
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
      } else {
        window.navigator.msSaveBlob(blob, fileName)
      }
    },
    handleReturn() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  padding-bottom: 15px;
  height: calc(100vh - 130px);
}
#minder-container {
  height: calc(100% - 50px);
  margin-top: 10px;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  box-shadow: 5px 0 7px 0 #bbb;
  z-index: 3;
  .submit {
    position: absolute;
    right: 20px;
    top: 10px;
  }
}
</style>
