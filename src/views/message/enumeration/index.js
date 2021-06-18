// 消息类型
const MESSAGE_TYPE = {
  CONCTRUCTION_MANAGE: {
    value: 'conctruction_manage',
    desc: '质量管理'
  },
  SAFETY_MANAGE: {
    value: 'safety_manage',
    desc: '安全管理'
  },
  CONSTRUCTION_DAILY_DIARY: {
    value: 'construction_daily_diary',
    desc: '施工日志管理'
  },
  MATERIAL_EQUIPMENT_MANAGE: {
    value: 'material_equipment_manage',
    desc: '物资设备管理'
  },
  PROCESS_MANAGE: {
    value: 'process_manage',
    desc: '进度管理管理'
  },
  WORKING_PROCEDURE_MANAGE: {
    value: 'working_procedure_manage',
    desc: '工序管理'
  },
  PERSONNEL_TRAINING_MANAGE: {
    value: 'personnel_training_manage',
    desc: '人员培训管理'
  },
  CHECK_WORK_MANAGE: {
    value: 'check_work_manage',
    desc: '考勤管理'
  },
  ENVIRONMENTAL_MONITORING_MANAGE: {
    value: 'environmental_monitoring_manage',
    desc: '环境监测'
  }
}

// 公告类型
const NOTICE_TYPE = {
  IMPORTANT_TYPE: {
    value: 'announcement-1',
    desc: '重要公告'
  },
  LEGAL_TYPE: {
    value: 'announcement-2',
    desc: '法定公告'
  },
  SPECIAL_TYPE: {
    value: 'announcement-3',
    desc: '专业公告'
  }
}
export default {
  MESSAGE_TYPE,
  NOTICE_TYPE
}
