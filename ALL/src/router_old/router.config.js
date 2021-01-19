import BasicLayout from '@/layouts/BasicLayout'
import RouteView from '@/layouts/RouteView'

export const basicRouterMap = [{
  path: '/login',
  name: 'login',
  component: (resolve) => require(['@/views/user/Login'], resolve)
},
{
  path: '/',
  name: 'nopath',
  component: (resolve) => require(['@/views/user/Login'], resolve)
}
];

// 一般用户路由表
export const asyncConsumerRouterMap = [{
  path: '/admin',
  component: BasicLayout,
  children: [{
    path: '/',
    name: 'welcome',
    component: (resolve) => require(['@/components/Welcome'], resolve)
  },
  // 政策管理
  {
    path: 'policy',
    name: 'policy',
    component: RouteView,
    meta: { keepAlive: false },
    children: [{
      path: 'onewaytrip',
      name: 'onewaytrip',
      component: (resolve) => require(['@/views/policymanage/OneWayTrip'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'onewaytrip/:id',
      name: 'onewaytripid',
      component: (resolve) => require(['@/views/policymanage/OneWayTrip'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'roundtrip',
      name: 'roundtrip',
      component: (resolve) => require(['@/views/policymanage/RoundTrip'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'roundtrip/:id',
      name: 'roundtypeid',
      component: (resolve) => require(['@/views/policymanage/RoundTrip'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'onewaytriptypethree',
      name: 'onewaytriptypethree',
      component: (resolve) => require(['@/views/policymanage/OneWayTripTypeThree'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'onewaytriptypethree/:id',
      name: 'onewaytriptypethreeid',
      component: (resolve) => require(['@/views/policymanage/OneWayTripTypeThree'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'jxhtj',
      name: 'jxhtj',
      component: (resolve) => require(['@/views/policymanage/PolicyManage'], resolve),
      meta: { keepAlive: true }
    }
    ]
  },

  // 原始数据
  {
    path: 'rawdata',
    name: 'rawdata',
    component: RouteView,
    meta: { keepAlive: false },
    children: [{
      path: 'list',
      name: 'directconnect',
      component: (resolve) => require(['@/views/rawdata/DirectConnect'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'adddata',
      name: 'adddata',
      component: (resolve) => require(['@/views/rawdata/AddData'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'adddata/:id',
      name: 'adddataid',
      component: (resolve) => require(['@/views/rawdata/AddData'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'apilist',
      name: 'apidirectconnect',
      component: (resolve) => require(['@/views/rawdata/DirectConnect'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'apiadddata',
      name: 'apiadddata',
      component: (resolve) => require(['@/views/rawdata/AddData'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'apiadddata/:id',
      name: 'apiadddataid',
      component: (resolve) => require(['@/views/rawdata/AddData'], resolve),
      meta: { keepAlive: true }
    },
    {
      path: 'apilistreturn',
      name: 'apidirectconnectreturn',
      component: (resolve) => require(['@/views/rawdata/DirectConnectReturn'], resolve),
      meta: { keepAlive: true }
    },
    { path: '*', name: '404-1', component: (resolve) => require(['@/views/errorpage/404'], resolve) },
    {
      path: 'cabins',
      name: 'cabins',
      component: (resolve) => require(['@/views/rawdata/Cabins'], resolve),
      meta: { keepAlive: true }
    }
    ]
  },
  // 自动调价
  {
    path: 'autoprice',
    name: 'autoprice',
    component: RouteView,
    meta: { title: '自动调价', keepAlive: true },
    children: [
      { path: 'rule', name: 'pricerule', component: (resolve) => require(['@/views/autoprice/PriceRule'], resolve), meta: { keepAlive: true } },
      { path: 'addpricerule', name: 'addpricerule', component: (resolve) => require(['@/views/autoprice/AddPriceRule'], resolve), meta: { keepAlive: true } },
      { path: 'addpricerule/:id', name: 'addpriceruleid', component: (resolve) => require(['@/views/autoprice/AddPriceRule'], resolve), meta: { keepAlive: true } },
      { path: 'earlywarning', name: 'earlywarning', component: (resolve) => require(['@/views/autoprice/EarlyWarning'], resolve), meta: { keepAlive: true } },
      { path: 'result', name: 'result', component: (resolve) => require(['@/views/autoprice/PriceResult'], resolve), meta: { keepAlive: true } }
    ]
  },
  // 数据更新
  {
    path: 'datarefresh',
    name: 'datarefresh',
    component: RouteView,
    meta: { title: '数据更新', keepAlive: true },
    children: [
      { path: 'rule', name: 'refreshrule', component: (resolve) => require(['@/views/datarefresh/RefreshRule'], resolve), meta: { keepAlive: true } },
      { path: 'addrefreshrule', name: 'addrefreshrule', component: (resolve) => require(['@/views/datarefresh/AddRefreshRule'], resolve), meta: { keepAlive: true } },
      { path: 'addrefreshrule/:id', name: 'addrefreshruleid', component: (resolve) => require(['@/views/datarefresh/AddRefreshRule'], resolve), meta: { keepAlive: true } },
      { path: 'warning', name: 'warning', component: (resolve) => require(['@/views/datarefresh/Warning'], resolve), meta: { keepAlive: true } }
    ]
  },
  // 基本设置
  {
    path: 'basicsetting',
    name: 'basicsetting',
    component: RouteView,
    meta: { title: '基本设置', keepAlive: true },
    children: [{
      path: 'whitelist',
      name: 'whitelist',
      component: (resolve) => require(['@/views/basicsetting/WhiteList'], resolve),
      meta: { title: '白名单', keepAlive: true }
    },
    {
      path: 'baggages',
      name: 'baggages',
      component: (resolve) => require(['@/views/basicsetting/Baggages'], resolve),
      meta: { title: '行李设置', keepAlive: true }
    },
    {
      path: 'stockwarning',
      name: 'stockwarning',
      component: (resolve) => require(['@/views/basicsetting/StockWarning'], resolve),
      meta: { title: '库存信息提醒', keepAlive: true }
    },
    {
      path: 'deletelog',
      name: 'deletelog',
      component: (resolve) => require(['@/views/specialpage/deleteLog'], resolve),
      meta: { title: '删除日志' }
    },
    {
      path: 'goldpit',
      name: 'goldpit',
      component: (resolve) => require(['@/views/basicsetting/GoldPit'], resolve),
      meta: { title: '金牌展示位配置', keepAlive: true }
    },
    {
      path: 'roundconfig',
      name: 'roundconfig',
      component: (resolve) => require(['@/views/basicsetting/ReturnConfig'], resolve),
      meta: { title: '往返优惠配置', keepAlive: true }
    },
    {
      path: 'wasteconfig',
      name: 'wasteconfig',
      component: (resolve) => require(['@/views/basicsetting/WasteConfig'], resolve),
      meta: { title: '平台占位配置', keepAlive: true }
    }
    ]
  },
  {
    path: '*',
    name: '404',
    component: (resolve) => require(['@/views/errorpage/404'], resolve)
  }
  ]
}];

// 超级管理员路由表
export const asyncAdminerRouterMap = [{
  path: '/admin',
  component: BasicLayout,
  children: [{
    path: '/',
    name: 'welcome',
    component: (resolve) => require(['@/components/Welcome'], resolve)
  },
  // 用户管理
  {
    path: 'userrole',
    name: 'userrole',
    component: RouteView,
    meta: { title: '用户管理', keepAlive: true },
    children: [{
      path: 'users',
      name: 'users',
      component: (resolve) => require(['@/views/user/UserManage'], resolve),
      meta: { title: '用户管理', keepAlive: true }
    },
    {
      path: 'userinfo/:phonenumber',
      name: 'userinfoid',
      component: (resolve) => require(['@/views/user/UserInfo'], resolve)
    },
    {
      path: 'userinfo',
      name: 'userinfo',
      component: (resolve) => require(['@/views/user/UserInfo'], resolve)
    }
    ]
  }
  ]
},
{
  path: '*',
  name: '404',
  component: (resolve) => require(['@/views/errorpage/404'], resolve)
}
];
