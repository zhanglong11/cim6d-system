<template>
  <div>
    <org-chart :tree="departmentListWithCompanyName[0]" />
  </div>
</template>

<script>
import Api from '@/views/system/api/department'
import OrgChart from '@/views/system/user/components/org-chart'
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'OrganizationPicture',
  components: { OrgChart },
  data() {
    // 这里存放数据
    return {
      departmentList: []
    }
  },
  computed: {
    departmentListWithCompanyName() {
      return this.departmentList
    }
  },
  created() {
    Api.getDepartment([]).then(res => {
      treeForEach(res.data, e => {
        e.label = e.name
        e.value = e.id
      })
      this.departmentList = res.data
    })
  },
  // 方法集合
  methods: {}
}
</script>
<style lang="less" scoped></style>
