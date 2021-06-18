<template>
  <div>
    <div class="title">基础信息</div>
    <div class="infoList">
      <ul>
        <li>企业名称：</li>
        <li>{{ companyInfoList.name }}</li>
      </ul>
      <ul>
        <li>
          公司资质：
        </li>
        <li>{{ $getLabelFromArg('companyQualification', companyInfoList.companyQualification) }}</li>
      </ul>
      <ul>
        <li>公司类型：</li>
        <li>{{ $getLabelFromArg('companyType', companyInfoList.companyType) }}</li>
      </ul>
    </div>
    <div class="infoList">
      <ul>
        <li>曾用名：</li>
        <li>{{ companyInfoList.legalPersonUsedName }}</li>
      </ul>
      <ul>
        <li>法定代表人：</li>
        <li>{{ companyInfoList.legalPerson }}</li>
      </ul>
      <ul>
        <li>法定代表人手机号：</li>
        <li>{{ companyInfoList.legalPersonMobile }}</li>
      </ul>
    </div>
    <div class="infoList">
      <ul>
        <li>联系人：</li>
        <li>{{ companyInfoList.limkman }}</li>
      </ul>
      <ul>
        <li>联系人手机号：</li>
        <li>{{ companyInfoList.linkmanMobile }}</li>
      </ul>
      <ul>
        <li>邮政编码：</li>
        <li>{{ companyInfoList.postalCode }}</li>
      </ul>
    </div>
    <div class="infoLine">
      <ul>
        <li>联系地址：</li>
        <li>{{ companyInfoList.contactDetailedAddress }}</li>
      </ul>
    </div>
    <div class="infoLine">
      <ul>
        <li>注册地址：</li>
        <li>{{ companyInfoList.registeredDetailedAddress }}</li>
      </ul>
    </div>
    <div class="infoList">
      <ul>
        <li>企业网址：</li>
        <li>{{ companyInfoList.officalWebsite }}</li>
      </ul>
      <ul>
        <li>传真：</li>
        <li>{{ companyInfoList.fax }}</li>
      </ul>
      <ul>
        <li>企业邮箱：</li>
        <li>{{ companyInfoList.email }}</li>
      </ul>
    </div>
    <div class="infoList">
      <ul>
        <li>成立日期：</li>
        <li>{{ companyInfoList.registerTime | formatData }}</li>
      </ul>
      <ul>
        <li>实缴资本：</li>
        <li>{{ companyInfoList.contributedCapital | wan }} 万</li>
      </ul>
      <ul>
        <li>经营状态：</li>
        <li>{{ $getLabelFromArg('manageStatus', companyInfoList.manageStatus) }}</li>
      </ul>
    </div>
    <div class="infoList">
      <ul>
        <li>注册机构：</li>
        <li>{{ companyInfoList.registrationAuthority }}</li>
      </ul>
      <ul>
        <li>工商注册号：</li>
        <li>{{ companyInfoList.businessRegistrationNumber }}</li>
      </ul>
      <ul>
        <li>统一社会信用代码：</li>
        <li>{{ companyInfoList.unifiedSocialCreditCode }}</li>
      </ul>
    </div>
    <div class="infoList">
      <ul>
        <li>核准日期：</li>
        <li>{{ companyInfoList.approvalTime | formatData }}</li>
      </ul>
      <ul>
        <li>纳税人识别号：</li>
        <li>{{ companyInfoList.taxpayerRegistrationNumber }}</li>
      </ul>
      <ul>
        <li>纳税人资质：</li>
        <li>{{ companyInfoList.taxpayerQualification }}</li>
      </ul>
    </div>
    <div class="infoList">
      <ul>
        <li>营业期限（起）：</li>
        <li>{{ companyInfoList.operatingPeriodStart | formatData }}</li>
      </ul>
      <ul>
        <li>营业期限（止）：</li>
        <li>{{ companyInfoList.operatingPeriodEnd | formatData }}</li>
      </ul>
      <ul>
        <li>注册资金：</li>
        <li>{{ companyInfoList.registeredCapital | wan }} 万</li>
      </ul>
    </div>
    <div class="infoList">
      <ul>
        <li>人员规模：</li>
        <li>{{ $getLabelFromArg('staffSize', companyInfoList.staffSize) }}</li>
      </ul>
      <ul>
        <li>参保人数：</li>
        <li>{{ companyInfoList.insuredSize }}</li>
      </ul>
      <ul>
        <li>组织机构代码：</li>
        <li>{{ companyInfoList.organizingInstitutionBarCode }}</li>
      </ul>
    </div>
    <div class="infoLine">
      <ul>
        <li>经营范围：</li>
        <li>{{ companyInfoList.businessScope }}</li>
      </ul>
    </div>
    <div class="infoList infoSecond">
      <ul>
        <li>企业状态：</li>
        <li>{{ ['禁用', '启用'][companyInfoList.status] }}</li>
      </ul>
      <ul>
        <li>登录名：</li>
        <li>{{ companyInfoList.loginName }}</li>
      </ul>
    </div>
    <div class="title">企业证件扫描件</div>
    <div class="infoImg">
      <ul>
        <li style="display: flex; justify-content: space-between;">
          <span>工商营业执照：</span><span><el-checkbox v-model="threeCertificateChecked">三证合一</el-checkbox></span>
        </li>
        <li>
          <el-image :src="fileUrl[0]" :fit="fit">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <!--          <img src="@/assets/images/login-bg.jpg" alt="">-->
          <!--          <img :src="fileUrl[0]" alt="">-->
        </li>
      </ul>
      <ul>
        <div v-if="!threeCertificateChecked">
          <li>组织机构代码：</li>
          <el-image :src="fileUrl[1]" :fit="fit">
            <div slot="error" class="image-slot">
              <!--              <i class="el-icon-picture-outline" />-->
            </div>
          </el-image>
          <!--        <img :src="fileUrl[1]" alt="">-->
          <!--        <li><img src="@/assets/images/login-bg.jpg" alt=""></li>-->
        </div>
      </ul>
      <ul>
        <div v-if="!threeCertificateChecked">
          <li>税务登记证：</li>
          <el-image :src="fileUrl[2]" :fit="fit">
            <div slot="error" class="image-slot">
              <!--              <i class="el-icon-picture-outline" />-->
            </div>
          </el-image>
          <!--        <img :src="fileUrl[2]" alt="">-->
          <!--        <li><img src="@/assets/images/login-bg.jpg" alt=""></li>-->
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '@/views/system/api/center'
import getPcaName from '@/utils/getPcaName'
import _ from 'lodash'
export default {
  name: 'EnterpriseInfo',
  data() {
    return {
      tabPosition: 'left',
      companyInfoList: {},
      fileUrl: [],
      fit: 'scale-down'
      // src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    }
  },
  computed: {
    // 三证合一
    threeCertificateChecked() {
      return this.fileUrl.length === 1
    }
  },
  created() {
    this.getCompanyInfo()
  },
  methods: {
    async getCompanyInfo() {
      const res = await api.getCompanyInfo()
      this.companyInfoList = res.data || {}
      // 联系地址
      const province = res.data.contactProvince
      const city = res.data.contactCity
      const district = res.data.contactMunicipalDistrict
      const address = res.data.contactDetailedAddress
      this.companyInfoList.contactDetailedAddress = [province, city, district].map(getPcaName).join(' ') + address
      // 注册地址
      const regProvince = res.data.registeredProvince
      const regCity = res.data.registeredCity
      const regDistrict = res.data.registeredMunicipalDistrict
      const resAddress = res.data.registeredDetailedAddress
      this.companyInfoList.registeredDetailedAddress =
        [regProvince, regCity, regDistrict].map(getPcaName).join(' ') + resAddress
      this.getImageList(res.data.certificationPictureIds.split(','))
    },
    // 获取三证图片
    async getImageList(id) {
      // console.log('22222', id)
      const res = await api.getImageList(id)
      // this.fileUrl = res.data.map(item => item.fileUrl)
      const objects = _.find(res.data, { id: id[0] })
      const objects2 = _.find(res.data, { id: id[1] })
      const objects3 = _.find(res.data, { id: id[2] })
      if (objects && objects.fileUrl) {
        this.fileUrl.push(objects.fileUrl)
      }
      if (objects2 && objects2.fileUrl) {
        this.fileUrl.push(objects2.fileUrl)
      }
      if (objects3 && objects3.fileUrl) {
        this.fileUrl.push(objects3.fileUrl)
      }
    }
  }
}
</script>

<style scoped lang="less">
.menuList {
  color: #333;
  /*height: calc(100vh - 30px);*/
  /*overflow-y:auto;*/
  /deep/.el-tabs__item.is-active {
    background: #e6f7ff;
  }
  h4 {
    font-size: 18px;
  }

  .infoList {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    /*padding-bottom: 20px;*/
    ul {
      display: flex;
      width: 33%;

      li {
        &:first-child {
          width: 150px;
          text-align: right;
          color: #999;
        }
      }
    }
  }
  .infoLine {
    margin-top: 10px;
    ul {
      display: flex;

      li {
        &:first-child {
          width: 152px;
          text-align: right;
          color: #999;
        }
      }
    }
  }
  .infoSecond {
    ul {
      width: 50%;
    }
  }
  .infoImg {
    display: flex;
    justify-content: space-around;

    ul {
      width: 33%;
      /*height: 200px;*/

      li {
        margin-left: 32px;
        &:first-child {
          margin-bottom: 10px;
          color: #999;
        }
        img {
          width: 100%;
          /*height: 250px;*/
          /*border: 1px solid #e5e5e5;*/
        }
      }
    }
  }
}
.title {
  background: #f2f2f2;
  border: 3px;
  padding: 5px 10px;
  margin: 10px 0;
  font-size: 15px;
}
.el-image {
  height: 300px;
}
</style>
