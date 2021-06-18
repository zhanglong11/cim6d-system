<template>
  <div class="container no-padding">
    <el-card class="tooltips">
      <div>
        <el-form inline>
          <el-form-item>
            <el-input v-model="queryForm.name" placeholder="表单名称" />
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item v-if="$hasPower('FormListAdd')">
            <el-button type="primary" icon="el-icon-plus" @click="addType()">新建分组</el-button>
          </el-form-item>
          <el-form-item v-if="$hasPower('FormListAdd')">
            <el-button type="primary" icon="el-icon-plus" @click="addForm()">新建表单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <template v-for="items in dataList">
      <el-card :key="items.categoryId">
        <div slot="header" class="clearfix">
          <span>{{ items.categoryName }}（{{ items.count }}）</span>
          <template v-if="items.categoryId != 0">
            <el-tooltip class="item" effect="dark" content="编辑分组" placement="bottom-start">
              <el-button type="text" class="group-btn" icon="el-icon-edit-outline" @click="editType(items)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除分组" placement="bottom-start">
              <el-button
                type="text"
                class="group-btn"
                icon="el-icon-delete"
                @click="deleteCategory(items.categoryId)"
              ></el-button>
            </el-tooltip>
          </template>
          <!-- <el-button style="float: right; padding: 3px 0;" type="text">操作按钮</el-button> -->
        </div>
        <div class="form-list">
          <ul>
            <li v-for="item in items.children" :key="item.id">
              <div class="box">
                <span class="icon el-icon-s-order"></span>
                <p class="name">
                  <b>{{ item.name }}</b>
                  <span>{{ item.description }}</span>
                </p>
                <p class="time">{{ item.creatorName }} {{ item.createTime | formatData }}</p>
                <p class="action">
                  <el-tooltip
                    v-if="$hasPower('FormListEdit')"
                    class="item"
                    effect="dark"
                    content="编辑表单"
                    placement="bottom-start"
                  >
                    <el-button type="text" icon="el-icon-edit-outline" @click="editForm(item.id)"></el-button>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$hasPower('FormListDelete')"
                    class="item"
                    effect="dark"
                    content="删除表单"
                    placement="bottom-start"
                  >
                    <el-button type="text" icon="el-icon-delete" @click="deleteForm(item.id)"></el-button>
                  </el-tooltip>

                  <!-- <el-button type="text" icon="el-icon-unlock"></el-button>
                  <el-button type="text" icon="el-icon-unlock"></el-button> -->
                </p>
              </div>
            </li>
          </ul>
          <p v-if="!items.count" class="no-data">暂无数据...</p>
        </div>
      </el-card>
    </template>
    <el-card v-show="dataList.length === 0">
      <p class="no-data">暂无数据...</p>
    </el-card>
    <!-- 编辑分类 start -->
    <EditType :id="typeModal.id" :visible.sync="typeModal.show" />
    <!-- 编辑分类 end -->
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-23 16:36:51
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-08-20 15:09:22
 */
import { formApi } from '@/views/form/api/form'
import EditType from './components/editType' // 编辑分类
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'FormList',
  components: {
    EditType
  },
  data() {
    // 这里存放数据
    return {
      queryForm: {
        // 查询条件
        name: ''
      },
      queryFormBack: {},
      dataList: [],
      // 分组模态框
      typeModal: {
        show: false,
        id: ''
      },
      // 分组树
      typeTree: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化
    init() {
      this.treeCategory()
    },
    // 分组树
    async treeCategory() {
      let params = {
        page: 1,
        rows: 100,
        type: 2
      }
      let result = await formApi.treeCategory(params)
      let datas = result.data
      let list = []
      this.typeTree = datas
      datas.map(item => {
        list.push({
          categoryId: item.id,
          categoryName: item.name,
          children: [],
          count: item.count
        })
      })
      list.push({
        categoryId: '0',
        categoryName: '无分组',
        children: [],
        count: 0
      })
      this.dataList = list
      this.queryList()
    },
    // 新增分组
    addType() {
      this.typeModal.id = ''
      this.typeModal.show = true
    },
    // 编辑分组
    editType(item) {
      this.typeModal.id = item.categoryId
      this.typeModal.show = true
    },
    // 删除分组
    deleteCategory(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await formApi.deleteCategory(id)
        this.$message.success('操作成功')
        this.init()
      })
    },
    // 自定义表单查询
    async queryList() {
      const result = await formApi.queryFormList(this.queryForm)
      const datas = result.data
      const list = datas || []
      let ids = _.map(this.dataList, 'categoryId')
      console.log(111, ids)
      list.map(item => {
        let index = ids.indexOf(item.categoryId + '')
        if (index >= 0) {
          this.dataList[index].count = item.count
          this.dataList[index].children = item.children
        }
      })
      // this.dataList = list
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.init()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.init()
    },
    // 新建表单
    addForm() {
      if (this.typeTree.length === 0) {
        this.$message({
          type: 'error',
          message: '请先添加分组!'
        })
        return
      }
      this.$router.push({
        path: '/form/add-form'
      })
    },
    // 修改表单
    editForm(id) {
      this.$router.push({
        path: `/form/edit-form?id=${id}`
      })
    },
    // 根据ID删除表单
    deleteForm(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteFormSuccess(id)
        })
        .catch(() => {})
    },
    // 根据ID删除表单 - 异步
    async deleteFormSuccess(id) {
      await formApi.deleteForm(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.search()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
.container {
  .el-card + .el-card {
    margin-top: 15px;
  }
  .tooltips /deep/.el-card__body {
    padding-bottom: 3px;
  }
}
.form-list {
  ul {
    li {
      display: inline-flex;
      align-items: center;
      width: 320px;
      margin-right: 15px;
      margin-bottom: 15px;
      .box {
        display: inline-flex;
        align-items: center;
        position: relative;
        width: 100%;
        height: 140px;
        overflow: hidden;
        border: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .icon {
          margin: 0 20px;
          font-size: 50px;
          color: #ddd;
        }
        .name {
          width: 70%;
          b {
            display: block;
            width: 100%;
            .ellipsis;
          }
        }
        .time,
        .action {
          position: absolute;
          right: 10px;
        }
        .time {
          top: 10px;
          font-size: 12px;
          color: #999;
        }
        .action {
          bottom: 0;
          /deep/.el-button {
            font-size: 18px;
          }
        }
      }
    }
  }
}
.group-btn {
  font-size: 20px;
}
/deep/.el-icon-delete {
  color: #f56c6c;
}
</style>
