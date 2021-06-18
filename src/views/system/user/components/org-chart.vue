<script type="text/jsx">
/**
 任务名称：2689/ 基础服务-用户管理（react->vue）迁移
 开发人员：李建敏
 日期：2020-3月-24日
 任务类型：1.全新代码
 **/
/**
任务名称：2689/ 基础服务-用户管理（react->vue）迁移
开发人员：李建敏
日期：2020-3月-25日
任务类型：2.重命名文件
**/
export default {
  name: 'OrgChart',
  props: {
    tree: {
      type: Object,
      required: true
    }
  },
  methods: {
    renderChildren(node, slot) {
      const hasSiblingRight = childIndex => {
        return (node.children || []).length > childIndex + 1
      }

      const hasSiblingLeft = childIndex => {
        return childIndex > 0
      }

      const nodeLineBelow = (
        <td colSpan={(node.children || []).length * 2} class='nodeGroupCellLines'>
          <table class='nodeLineTable'>
            <tbody>
              <tr>
                <td colSpan={2} class='nodeLineCell nodeGroupLineVerticalMiddle' />
                <td colSpan={2} class='nodeLineCell' />
              </tr>
            </tbody>
          </table>
        </td>
      )

      const childrenLinesAbove = (node.children || []).map((child, childIndex) => (
        <td colSpan='2' class='nodeGroupCellLines' key={childIndex}>
          <table class='nodeLineTable'>
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  class={
                    'nodeLineCell nodeGroupLineVerticalMiddle' +
          (hasSiblingLeft(childIndex) ? ' nodeLineBorderTop' : '')
                  }
                />
                <td colSpan={2} class={'nodeLineCell' + (hasSiblingRight(childIndex) ? ' nodeLineBorderTop' : '')} />
              </tr>
            </tbody>
          </table>
        </td>
      ))

      const children = (node.children || []).map((child, childIndex) => (
        <td colSpan='2' class='nodeGroupCell' key={childIndex}>
          {this.renderChildren(child, slot)}
        </td>
      ))

      return (
        <table class='orgNodeChildGroup'>
          <tbody>
            <tr>
              <td class='nodeCell' colSpan={(node.children || []).length * 2}>
                <el-button type='primary' size='medium' class='node'>
                  {node.name}
                </el-button>
              </td>
            </tr>
            <tr>{(node.children || []).length > 0 && nodeLineBelow}</tr>
            <tr>{childrenLinesAbove}</tr>
            <tr>{children}</tr>
          </tbody>
        </table>
      )
    }
  },
  render() {
    return <div class='reactOrgChart'>{this.renderChildren(this.tree)}</div>
  }
}
</script>

<style lang="less">
.reactOrgChart {
  margin: 2px;
}

.reactOrgChart .orgNodeChildGroup .node {
}

.reactOrgChart .orgNodeChildGroup .nodeCell {
  text-align: center;
}

.reactOrgChart .orgNodeChildGroup .nodeGroupCell {
  vertical-align: top;
}

.reactOrgChart .orgNodeChildGroup .nodeGroupLineVerticalMiddle {
  height: 25px;
  width: 50%;
  border-right: 2px solid #000;
}

.reactOrgChart .nodeLineBorderTop {
  border-top: solid 2px #000;
}

.reactOrgChart table {
  border-collapse: collapse;
  border: none;
  margin: 0 auto;
}

.reactOrgChart td {
  padding: 0;
}

.reactOrgChart table.nodeLineTable {
  width: 100%;
}

.reactOrgChart table td.nodeCell {
  width: 50%;
  .el-button {
    padding: 6px 6px;
  }
}
</style>
