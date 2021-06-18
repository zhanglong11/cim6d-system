/**
任务名称：2904/【智慧工地2.0-前端】物联网转Vue模块》环境监控》监控设备》产品、设备模块切图及功能开发
开发人员：李建敏
日期：2020-4月-9日
任务类型：1、全新代码
**/

export default {
  product: {
    DONGTAIZHUCE:
      '设备动态注册无需一一烧录设备证书，每台设备烧录相同的产品证书，即ProductKey和ProductSecret，云端鉴权通过后下发设备证书，您可以根据需要开启或关闭动态注册，保障安全性。',
    RESET_SECRET: '重置后将导致原有ProductSecret失效，您需要将新生成的ProductSecret烧录到设备中，是否确定要重置？',
    TOPIC_CLASS: '产品下的所有设备都会继承该产品的Topic类',
    TOPIC_CLASS_FORMAT:
      'Topic格式必须以“/”进行分层，区分每个类目。其中前三个类目已经规定好，第一个代表产品标识productKey，第二个${deviceName}通配deviceName，第三个user用来标识产品的自定义Topic类。简单来说，Topic类：/a15T****dhK/${deviceName}/user/update 是具体Topic：/a15T****dhK/mydevice1/user/update和/a15T****dhK/mydevice2/user/update等的集合。',
    NORM_FUNCTION: '根据产品的设备类型，我们已为您自动创建了标准功能，您还可以添加可选功能。',
    CUSTOM_FUNCTION: '如果标准功能无法满足您的需求，您还可以添加自定义功能。'
  },
  device: {
    SHEBEIZONGSHU: '当前指定产品的设备总数',
    JIHUOSHEBEI: '当前已激活的设备总数',
    ZAIXIANSHEBEI: '当前在线的设备总数',
    SPECIAL_VERSION: '特别说明: deviceName可以为空，当为空时，阿里云会颁发全局唯一标识符作为deviceName。',
    BATCH_LIST: '您可按批次下载设备激活凭证 (.csv)，批量烧录到设备中。',
    BEIZHUMINGCHENG: '支持中文、英文字母、数字和下划线，4~64个字符，中文算两个',
    SHISHIYANCHI: '根据 MQTT 协议 QoS1 消息的 ACK 回执时间估算出的设备网络延迟实时值，暂不支持测试其他协议连接的设备',
    TOPIC_LIST: '请使用以下Topic进行设备数据的上下行',
    FABUXIAOXISHU: '7天内发布消息数，统计有一定延迟。',
    ATTENTION: '注意：如果该Topic正在被使用,请谨慎操作,以防岀现异常。这里发布的消息不会被服务端订阅到。',
    RUNSTATUS: '设备数据上报的最新属性值，点击“查看数据”可以查看指定属性的历史数据'
  }
}
