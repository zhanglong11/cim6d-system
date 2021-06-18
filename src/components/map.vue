<template>
  <baidu-map
    class="map"
    :center="center"
    :zoom="zoom"
    :scroll-wheel-zoom="true"
    @ready="handler"
    @click="handleClick"
    @moving="syncCenterAndZoom"
    @moveend="syncCenterAndZoom"
    @zoomend="syncCenterAndZoom"
  >
    <!-- 地图容器 -->
    <bm-view class="view" />
    <!-- 自定义控件--搜索框 -->
    <bm-control anchor="BMAP_ANCHOR_TOP_LEFT">
      <bm-auto-complete v-model="keyword" :sug-style="{ zIndex: 999999 }">
        <div id="searchbox" class="clearfix">
          <div id="searchbox-container">
            <div id="sole-searchbox-content" class="searchbox-content">
              <input
                id="sole-input"
                v-model.trim="keyword"
                class="searchbox-content-common"
                type="text"
                name="word"
                autocomplete="off"
                maxlength="256"
                placeholder="搜地点"
              />
            </div>
          </div>
        </div>
      </bm-auto-complete>
    </bm-control>
    <!-- 搜索组件,展示搜索结果 -->
    <bm-local-search
      id="search-result-panel"
      :panel="false"
      :page-capacity="8"
      :keyword="keyword"
      :auto-viewport="true"
      anchor="BMAP_ANCHOR_TOP_LEFT"
    />

    <!-- 比例尺组件 -->
    <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT" />
    <!-- 手动定位组件 -->
    <bm-geolocation
      anchor="BMAP_ANCHOR_TOP_RIGHT"
      :show-address-bar="true"
      :auto-location="true"
      @locationSuccess="handleLocationSuccess"
    />
    <bm-marker :position="markerPoint" :dragging="true">
      <bm-label :content="address" :label-style="labelStyle" :offset="{ width: -35, height: 30 }" />
    </bm-marker>
  </baidu-map>
</template>

<script>
export default {
  // props: ['mapType',''],
  components: {},
  props: {
    mapType: {
      // 类型关键字
      type: String,
      default: ''
    },
    selectedPosition: {
      // 默认选中为位置，若不为空，设置未中心点
      type: String,
      default: ''
    },
    address: {
      // 详细地址用来展示marker
      type: String,
      default: ''
    }
  },
  data() {
    return {
      BMap: null, // BMap 事例
      center: {
        lng: 116.4,
        lat: 39.9
      },
      zoom: 13,
      keyword: '',
      markerPoint: {},
      labelStyle: {
        padding: '10px',
        fontSize: '13px',
        border: '1px solid #ccc !important',
        borderRadius: '4px'
      }
    }
  },
  watch: {
    selectedPosition(val) {
      this.center = val
    },
    address(val) {
      this.setMarkerInfo()
    }
  },
  methods: {
    handler({ BMap, map }) {
      const that = this
      this.BMap = BMap
      this.setMarkerInfo()
      if (this.selectedPosition) {
        this.center = Object.assign({}, this.selectedPosition)
        return
      }
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() === BMAP_STATUS_SUCCESS) {
          // console.log('设置中心点', r)
          that.center.lng = r.longitude
          that.center.lat = r.latitude
        } else {
          alert('failed' + this.getStatus())
        }
      })
    },
    // 根据具体位置获取其经纬度，设置marker
    setMarkerInfo() {
      const geoCoder = new this.BMap.Geocoder()
      if (this.address) {
        geoCoder.getPoint(
          this.address,
          Point => {
            this.markerPoint = {
              lng: Point.lng,
              lat: Point.lat
            }
          },
          this.selectedPosition
        )
      }
    },
    // 点击获取选中位置的具体信息
    handleClick(event) {
      this.center = {
        lng: event.point.lng,
        lat: event.point.lat
      }
      if (this.BMap) {
        const geoCoder = new this.BMap.Geocoder()
        geoCoder.getLocation(event.point, res => {
          const addrComponent = res.addressComponents
          const surroundingPois = res.surroundingPois
          const province = addrComponent.province
          const city = addrComponent.city
          const district = addrComponent.district
          let addr = addrComponent.street
          if (surroundingPois.length > 0 && surroundingPois[0].title) {
            if (addr) {
              addr += `-${surroundingPois[0].title}`
            } else {
              addr += `${surroundingPois[0].title}`
            }
          } else {
            addr += addrComponent.streetNumber
          }
          this.choosedLocation = {
            province,
            city,
            district,
            addr,
            mapType: this.mapType,
            latitude: res.point.lat,
            longitude: res.point.lng
          }
          this.$emit('choosedLocation', this.choosedLocation)
        })
      }
      this.keyword = ''
    },

    handleLocationSuccess(event) {
      // console.log('定位成功', event)
      this.center = {
        lng: event.point.lng,
        lat: event.point.lat
      }
    },
    // 避免手动放大后选中位置后地图zoom还原未原值，导致跳动
    syncCenterAndZoom(e) {
      // 返回地图当前的缩放级别
      this.zoom = e.target.getZoom()
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  width: 1000px;
  height: 600px;
  position: relative;

  .view {
    width: 100%;
    height: 100%;
  }

  // #search-result-panel {
  //   position: absolute;
  //   z-index: 20;
  //   top: 60px;
  //   left: 20px;
  // }
}

#searchbox {
  border-radius: 2px;
  width: 425px;
  position: relative;
  z-index: 5;
  top: 20px;
  left: 20px;

  #searchbox-container {
    position: relative;
    z-index: 2;
    pointer-events: auto;
    width: 368px;
    float: left;
    box-sizing: border-box;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);

    .searchbox-content {
      width: 368px;
      border-radius: 2px 0 0 2px;
      position: relative;
      background: #fff;
    }

    #sole-input {
      box-sizing: border-box;
      border: 0;
      padding: 9px 0;
      border-left: 10px solid transparent;
      border-right: 27px solid transparent;
      line-height: 20px;
      font-size: 16px;
      height: 38px;
      color: #333;
      position: relative;
      border-radius: 2px 0 0 2px;
      float: left;
      width: 100%;
      outline: none;
    }
  }

  #search-button {
    pointer-events: auto;
    width: 57px;
    height: 38px;
    float: left;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.15) 1px 2px 1px;
    background: rgb(51, 133, 255);
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    padding: 0px;
    border-radius: 0px 2px 2px 0px;
    color: #fff;
  }
}
</style>
