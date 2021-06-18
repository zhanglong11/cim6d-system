<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ details.title }}</span>
        <el-tag v-if="$enum.getDescByValue('MESSAGE_TYPE', details.category)">
          {{ $enum.getDescByValue('MESSAGE_TYPE', details.category) }}
        </el-tag>
      </div>
      <div class="details">
        <el-row>
          <el-col>
            <span class="label">创建时间</span>
            <span>{{ details.createTime }}</span>
          </el-col>
          <el-col>
            <span class="label">创建人</span>
            <span>{{ details.creatorName }}</span>
          </el-col>
          <el-col>
            <span class="label">状态</span>
            <span><el-switch :value="details.status === 1" /> {{ details.status ? '已读' : '未读' }}</span>
          </el-col>
          <el-col>
            <span class="label">正文</span>
            <span>{{ details.content }}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
/**
  任务名称：task#2854 【智慧工地2.0-前端】工作台切图及功能开发
  开发人员：耿为刚
  日期：2020-04-01
**/
import { messageApi } from '@/views/message/api/message'
export default {
  name: 'WorkBenchMessageDetails',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      details: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDetails()
  },
  // 方法集合
  methods: {
    // 获取消息详情
    async getDetails() {
      if (!this.id) {
        return
      }
      const result = await messageApi.getDetailsMessage(this.id)
      const datas = result.data
      datas.receiverName = ''
      this.details = datas
      this.readMessage(datas.id)
    },
    // 查询用户详情
    async readMessage(id) {
      await messageApi.readMessage(id)
      this.$store.dispatch('message/getUnreadMessage')
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.details {
  font-size: 14px;
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #ccc;
    display: inline-block;
    width: 150px;
    text-align: right;
  }
  .title {
    margin-bottom: 30px;
    font-size: 20px;
  }
  .status {
    display: flex;
    align-items: center;
    font-size: 14px;
    i {
      margin-right: 6px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00cc00;
    }
    &.status-2 i {
      background: #999;
    }
    &.status-3 i {
      background: #ff9900;
    }
  }
  .upload-con {
    display: flex;
    .upload-list {
      margin-bottom: 10px;
    }
  }
}
</style>
