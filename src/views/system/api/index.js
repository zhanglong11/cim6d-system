/**
 任务名称：2689/ 基础服务-用户管理（react->vue）迁移
 开发人员：李建敏
 日期：2020-3月-24日
 任务类型：1.全新代码
 **/
import axios from '@/utils/request'
export default {
  getCompanyInfo() {
    return axios.system.get('cim6d/system/company/info/get').then(res => res.data)
  }
}
