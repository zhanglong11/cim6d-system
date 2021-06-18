<template>
  <div>
    <el-button class="export-button el-icon-download" @click="exportImage">项目机构图下载</el-button>
    <div id="org-chart"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import treeForEach from '@/utils/treeForEach'
import { projectApi } from '@/views/system/api/project'
import toTree from '@/utils/toTree'
export default {
  name: 'OrgChart',
  props: {
    /**
     * 参项单位人员数据
     */
    data: {
      type: Array,
      required: true
    },
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      graph: null
    }
  },
  watch: {
    data(val) {
      if (val) this.refresh()
    }
  },
  created() {},
  mounted() {
    G6.registerEdge('flow-line', {
      draw(cfg, group) {
        const startPoint = cfg.startPoint
        const endPoint = cfg.endPoint
        const { style } = cfg
        const typeDifference = cfg.targetNode._cfg.model.dataType < 2 ? 23 : 0
        const middleX = (cfg.targetNode._cfg.bboxCache.minX - typeDifference + cfg.sourceNode._cfg.bboxCache.maxX) / 2
        const shape = group.addShape('path', {
          attrs: {
            stroke: cfg.sourceNode._cfg.model.opt.color,
            lineWidth: style.lineWidth,
            endArrow: style.endArrow,
            path: [
              ['M', startPoint.x, startPoint.y],
              ['L', middleX, startPoint.y],
              ['L', middleX, endPoint.y],
              ['L', endPoint.x, endPoint.y]
            ]
          }
        })
        return shape
      }
    })
    G6.registerNode(
      'custom-node',
      {
        draw(cfg, group) {
          if (cfg.dataType < 2) {
            // 左侧图标
            group.addShape('image', {
              attrs: {
                x: 8,
                y: 0,
                radius: 5,
                width: 24,
                height: 24,
                img: cfg.opt.icon
              },
              name: 'image-shape'
            })
            // 图标border
            group.addShape('rect', {
              attrs: {
                x: 8,
                stroke: cfg.opt.color,
                lineWidth: 3,
                radius: 5,
                width: 24,
                height: 24
              }
            })
            // 长方形条，文字的背景
            const keyShape = group.addShape('rect', {
              attrs: {
                x: 31,
                y: 2,
                fill: cfg.opt.color,
                radius: 3,
                width: (cfg.label.length + 2) * 12 + 20,
                height: 20
              }
            })

            group.addShape('text', {
              attrs: {
                fill: '#fff',
                fontSize: 12,
                text: cfg.label + ' (' + _.size(cfg.children) + ')',
                x: 40,
                y: 19
              }
            })
            return keyShape
          } else {
            let text = cfg.label + ' '
            if (cfg.dataType === 2) {
              text += cfg.userNumber || ` (${_.size(cfg.children)})` || ''
            } else if (cfg.dataType === 3) {
              text += cfg.mobile || cfg.participantUserPhone
            }
            group.addShape('text', {
              attrs: {
                fill: '#000',
                fontWeight: 'bold',
                fontSize: 12,
                text,
                x: 40,
                y: -8
              }
            })

            group.addShape('image', {
              attrs: {
                x: 8,
                y: -24,
                radius: 5,
                width: 24,
                height: 24,
                img: cfg.opt.icon
              },
              name: 'image-shape'
            })

            group.addShape('rect', {
              attrs: {
                x: 8,
                y: -24,
                stroke: cfg.opt.color,
                lineWidth: 3,
                radius: [3, 3, 0, 3],
                width: 24,
                height: 24
              }
            })
            const keyShape = group.addShape('path', {
              attrs: {
                path: [
                  ['M', 10, 0], // 上部顶点
                  ['L', cfg.dataType === 2 ? cfg.label.length * 12 + 60 : 180, 0], // 右侧顶点
                  ['Z'] // 封闭
                ],
                stroke: cfg.opt.color,
                lineWidth: 3
              }
            })
            return keyShape
          }
        }
      },
      'single-node'
    )
    const width = document.getElementById('org-chart').scrollWidth || 800
    const height = document.getElementById('org-chart').scrollHeight || 1000
    const graph = new G6.TreeGraph({
      container: 'org-chart',
      width,
      height,
      maxZoom: 2,
      linkCenter: true,
      modes: {
        default: ['collapse-expand', 'drag-canvas', 'zoom-canvas']
      },
      defaultNode: {
        type: 'custom-node',
        size: [200, 30],
        style: {
          fill: '#91d5ff',
          stroke: '#40a9ff',
          radius: 5
        },
        labelCfg: {
          style: {
            fill: '#000',
            fontSize: 12
          }
        }
      },
      defaultEdge: {
        type: 'flow-line',
        style: {
          stroke: 'l(0) 0:#672EBC 0.62:#672EBC 0.62:#00B492 1:#00B492',
          lineWidth: 3
        }
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getId: function getId(d) {
          return d.id
        },
        getHeight: function getHeight() {
          return 16
        },
        getWidth: function getWidth(ff) {
          return 16
        },
        getVGap: function getVGap(ff) {
          return 20
        },
        getHGap: function getHGap(ff) {
          const childrenMaxLabel = _.maxBy(ff.children, e => e.label.length)
          const childrenMaxLabelLength = childrenMaxLabel ? childrenMaxLabel.label.length : 0
          return ((ff.label.length + childrenMaxLabelLength) / 2) * 10 + 40
        }
      }
    })
    this.graph = graph
    this.refresh()
  },
  methods: {
    async refresh() {
      if (!this.project.id) return false
      let data = _.cloneDeep(this.data)
      let departmentList = await projectApi.getProjectOrganList({ projectId: this.project.id }).then(res => res.data)
      departmentList = _.get(toTree(departmentList, 'parentId'), '0.children')
      console.log(111, departmentList, data)
      let treeData = {
        label: this.project.name,
        id: 'root',
        dataType: -1,
        opt: {
          color: '#00B492',
          icon: 'http://static.doveaz.xyz/img/20200806153029.png'
        },
        children: [
          {
            id: 'root1',
            dataType: -1,
            label: '项目部',
            opt: {
              color: '#00B492',
              icon: 'http://static.doveaz.xyz/img/20200806153029.png'
            },
            children: departmentList
          },
          {
            id: 'root2',
            dataType: -1,
            label: '项目参与方',
            opt: {
              color: '#00B492',
              icon: 'http://static.doveaz.xyz/img/20200806153029.png'
            },
            children: data
          }
        ]
      }
      treeForEach([treeData], e => {
        const config = {
          0: {
            color: '#6EA72C',
            icon: 'http://static.doveaz.xyz/img/20200806153029.png'
          },
          1: {
            color: '#0095C9',
            icon: 'http://static.doveaz.xyz/img/20200806153029.png'
          },
          2: {
            color: '#6E37BE',
            icon: 'http://static.doveaz.xyz/img/20200807084940.png'
          },
          3: {
            color: '#C2402E',
            icon: 'http://static.doveaz.xyz/img/20200807084817.png'
          }
        }
        e.opt = config[e.type] || {
          color: '#00B492',
          icon: 'http://static.doveaz.xyz/img/20200806153029.png'
        }
        e.dataType = e.type || -1
        if (e.dataType === 2) {
          e.collapsed = true
        }
        if (_.size(e.children) >= 10) {
          e.collapsed = true
        }
        e.label = e.label || e.name
        delete e.type
      })
      this.graph.data(treeData)
      this.graph.render()
      this.graph.fitView()
    },
    exportImage() {
      this.graph.downloadFullImage(this.project.name + '-机构图', 'image/jpeg', {
        backgroundColor: '#fff',
        padding: [30, 15, 15, 15]
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
@import '~@/styles/mixin.scss';
.export-button {
  position: absolute;
  top: 10px;
  left: 10px;
  &:before {
    color: $primary-color;
    margin-right: 5px;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>

<style lang="less">
#org-chart {
  width: 100%;
  height: calc(100vh - 100px);
}
.icon-rect {
  display: flex;
  align-items: center;
  color: #fff;
  width: 100%;
  img {
    width: 30px;
    height: 30px;
    border-radius: 5px;
  }
  span {
    padding: 3px 5px;
    font-size: 12px;
    flex: 1;
    border-radius: 0 5px 5px 0;
  }
}
.icon-line-user {
  display: flex;
  align-items: center;
  position: relative;
  top: -17px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 5px 5px 0 0;
    border-bottom: 0 !important;
  }
  span {
    padding: 3px 5px;
    color: #333;
    font-weight: bold;
  }
}
foreignObject {
  overflow: visible;
}
#org-chart {
  background-color: #fff;
}
</style>
