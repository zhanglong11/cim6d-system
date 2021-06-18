<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    const isElicon = icon.indexOf('el-icon') >= 0
    /*
    兼容element图标处理
    * @Author: 耿为刚 创建
    * @Date: 2020-03-18 15:34:55
    * @Last Modified by: gengweigang
    * @Last Modified time: 2020-03-18 15:35:22
    */
    if (icon && !isElicon) {
      vnodes.push(<svg-icon icon-class={icon} />)
    }
    if (icon && isElicon) {
      vnodes.push(<i class={icon} />)
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>)
    }
    return vnodes
  }
}
</script>
