<!--
/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-10日
任务类型：1、全新代码
**/
-->
<template>
  <el-dialog :visible="visible" title="添加标准功能" width="600px" @close="close">
    <div class="head">
      <div>
        <span>选择功能：</span>
        <span @click="addAll">全选添加</span>
      </div>
      <div></div>
      <div>
        <span>已选功能：</span>
        <span @click="removeAll">全选删除</span>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="btn-group">
          <el-radio-group v-model="activeType">
            <el-radio-button :label="1">{{ product.templateName }}</el-radio-button>
            <el-radio-button :label="2">其他类型</el-radio-button>
          </el-radio-group>
        </div>
        <div class="left-list">
          <div v-for="item in computedList" :key="item.id" class="left-list-item">
            <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
          </div>
        </div>
      </div>
      <div class="middle">
        <div>&gt;</div>
        <div>&lt;</div>
      </div>
      <div class="right">
        <div class="right-list">
          <div v-for="item in checkedList" :key="item.id" class="right-list-item">
            <span>{{ item.name }}</span>
            <span @click="() => (item.checked = false)">x</span>
          </div>
        </div>
      </div>
    </div>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :disabled="!checkedList.length" @click="submit">添加</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'FunctionNormalAdd',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [],
      activeType: 1
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    computedList() {
      return this.list.filter(e => e.type === this.activeType)
    },

    checkedList() {
      return this.list.filter(e => e.checked)
    }
  },
  watch: {
    visible() {
      if (this.visible && this.id) {
        this.refresh()
      }
    },
    list: {
      deep: true,
      handler() {
        this.target = this.list.filter(e => e.checked)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    async refresh() {
      let current = await this.axios.iot.get(`attribute/list/${this.product.templateId}/1`).then(res => res.data)
      current.forEach(e => (e.type = 1))
      let other = await this.axios.iot.get(`attribute/list/${this.product.templateId}/2`).then(res => res.data)
      other.forEach(e => (e.type = 2))
      let list = current.concat(other)
      list.forEach(e => (e.checked = false))
      this.list = list
    },
    async submit() {
      await this.axios.iot
        .post(
          'product/standard/attribute/bind/' + this.product.id,
          this.checkedList.map(e => e.id)
        )
        .then(res => {
          this.$message.success('添加成功')
        })
      this.$parent.refresh()
      this.close()
    },
    addAll() {
      this.list = this.list.map(e => ({ ...e, checked: true }))
    },
    removeAll() {
      this.list = this.list.map(e => ({ ...e, checked: false }))
    },
    async close() {
      this.removeAll()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
.head {
  display: flex;
  padding-bottom: 10px;

  > div:nth-child(1) {
    flex: 1;
    display: flex;
    justify-content: space-between;

    > span:last-child {
      cursor: pointer;
      color: #1890ff;
    }
  }

  > div:nth-child(2) {
    flex: 30px 0;
  }

  > div:nth-child(3) {
    flex: 1;
    display: flex;
    justify-content: space-between;

    > span:last-child {
      cursor: pointer;
      color: #1890ff;
    }
  }
}

.content {
  display: flex;
  height: 300px;

  .left {
    flex: 1;
    border: solid 1px #e5e5e5;

    .btn-group {
      display: flex;
      justify-content: center;
      padding-top: 14px;
    }

    &-list {
      padding: 10px;
      height: calc(100% - 46px);
      overflow-y: auto;

      &-item {
        padding: 5px;
      }
    }
  }

  .right {
    flex: 1;
    border: solid 1px #e5e5e5;

    &-list {
      padding: 10px;
      height: 100%;
      overflow-y: auto;

      &-item {
        padding: 5px;
        display: flex;
        justify-content: space-between;

        > span:last-child {
          cursor: pointer;
          padding: 0 4px;
        }
      }
    }
  }

  .middle {
    flex: 30px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
