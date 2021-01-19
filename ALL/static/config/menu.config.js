export const spnames = ['陈宗宗', '吴小荣', '朱小双', '桂晨晨', '张宵雨', '鲁挺', '陈栋', '施佳辉', '查秀秀'];
// 特殊
export const asyncConsumerMenuSP = [{
  key: 'policy',
  name: '政策管理',
  icon: 'file-text',
  children: [
    { key: 'jxhtj', name: '精细化调价', to: '/admin/policy/jxhtj' }
  ]
},
{
  key: 'rawdata',
  name: '原始数据',
  icon: 'menu',
  children: [
    { key: 'directconnect', name: '直连数据', to: '/admin/rawdata/list' },
    { key: 'apidirectconnect', name: '直连数据(API)', to: '/admin/rawdata/apilist' },
    { key: 'apidirectconnectreturn', name: '直连数据(往返)', to: '/admin/rawdata/apilistreturn' },
    { key: 'cabins', name: '舱位管理', to: '/admin/rawdata/cabins' }
  ]
},
{
  key: 'autoprice',
  name: '自动调价',
  icon: 'dollar',
  children: [
    { key: 'displayrate', name: '展示率', to: '/admin/autoprice/displayrate' },
    { key: 'pricerule', name: '自动调价规则', to: '/admin/autoprice/rule' },
    { key: 'earlywarning', name: '自动调价预警', to: '/admin/autoprice/earlywarning' },
    { key: 'result', name: '自动调价结果', to: '/admin/autoprice/result' }
  ]
},
{
  key: 'datarefresh',
  name: '数据更新',
  icon: 'dollar',
  children: [
    { key: 'refreshrule', name: '数据更新规则', to: '/admin/datarefresh/rule' },
    { key: 'warning', name: '数据预警', to: '/admin/datarefresh/warning' }
  ]
},
{
  key: 'basicsetting',
  name: '基本配置',
  icon: 'setting',
  children: [
    { key: 'baggages', name: '行李设置', to: '/admin/basicsetting/baggages' },
    { key: 'whitelist', name: '黑名单', to: '/admin/basicsetting/whitelist' },
    { key: 'stockwarning', name: '库存信息提醒', to: '/admin/basicsetting/stockwarning' },
    { key: 'deletelog', name: '删除日志', to: '/admin/basicsetting/deletelog' },
    { key: 'goldpit', name: '金牌展示位', to: '/admin/basicsetting/goldpit' },
    { key: 'roundconfig', name: '往返优惠配置', to: '/admin/basicsetting/roundconfig' },
    { key: 'wasteconfig', name: '平台占位配置', to: '/admin/basicsetting/wasteconfig' }
  ]
}
];
// 普通用户菜单
export const asyncConsumerMenu = [{
  key: 'policy',
  name: '政策管理',
  icon: 'file-text',
  children: [
    { key: 'jxhtj', name: '精细化调价', to: '/admin/policy/jxhtj' }
  ]
},
{
  key: 'rawdata',
  name: '原始数据',
  icon: 'menu',
  children: [
    { key: 'directconnect', name: '直连数据', to: '/admin/rawdata/list' },
    { key: 'apidirectconnect', name: '直连数据(API)', to: '/admin/rawdata/apilist' },
    { key: 'cabins', name: '舱位管理', to: '/admin/rawdata/cabins' }
  ]
},
{
  key: 'autoprice',
  name: '自动调价',
  icon: 'dollar',
  children: [
    { key: 'displayrate', name: '展示率', to: '/admin/autoprice/displayrate' },
    { key: 'pricerule', name: '自动调价规则', to: '/admin/autoprice/rule' },
    { key: 'earlywarning', name: '自动调价预警', to: '/admin/autoprice/earlywarning' },
    { key: 'result', name: '自动调价结果', to: '/admin/autoprice/result' }
  ]
},
{
  key: 'datarefresh',
  name: '数据更新',
  icon: 'dollar',
  children: [
    { key: 'refreshrule', name: '数据更新规则', to: '/admin/datarefresh/rule' },
    { key: 'warning', name: '数据预警', to: '/admin/datarefresh/warning' }
  ]
},
{
  key: 'basicsetting',
  name: '基本配置',
  icon: 'setting',
  children: [
    { key: 'baggages', name: '行李设置', to: '/admin/basicsetting/baggages' },
    { key: 'whitelist', name: '黑名单', to: '/admin/basicsetting/whitelist' },
    { key: 'stockwarning', name: '库存信息提醒', to: '/admin/basicsetting/stockwarning' },
    { key: 'deletelog', name: '删除日志', to: '/admin/basicsetting/deletelog' },
    { key: 'goldpit', name: '金牌展示位', to: '/admin/basicsetting/goldpit' },
    { key: 'wasteconfig', name: '平台占位配置', to: '/admin/basicsetting/wasteconfig' }
  ]
}
];

// 超级管理员菜单
export const asyncAdminerMenu = [{
  key: 'userrole',
  name: '用户管理',
  icon: 'user',
  children: [{ key: 'users', name: '用户管理', to: '/admin/userrole/users' }]
}];
