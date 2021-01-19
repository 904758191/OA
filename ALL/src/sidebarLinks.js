export default [
  {
    name: 'Dashboard',
    // icon: 'ti-panel',
    collapsed: false,
    children: [{
      name: 'Overview',
      path: '/admin/overview'
    },
    {
      name: 'Stats',
      path: '/admin/stats'
    }]
  },
  {
    name: 'Components',
    // icon: 'ti-package',
    children: [{
      name: 'Buttons',
      path: '/components/buttons'
    },
    {
      name: 'Grid System',
      path: '/components/grid-system'
    },
    {
      name: 'Panels',
      path: '/components/panels'
    },
    {
      name: 'Sweet Alert',
      path: '/components/sweet-alert'
    },
    {
      name: 'Notifications',
      path: '/components/notifications'
    },
    {
      name: 'Icons',
      path: '/components/icons'
    },
    {
      name: 'Typography',
      path: '/components/typography'
    }]
  },
  {
    name: ' 运价管理',
    icon: 'ti-clipboard',
    children: [{
      name: ' 航班数据',
      path: '/forms/hangbandate'
    },
    {
      name: ' TF数据',
      path: '/forms/tfdate'
    },
    {
      name: ' Validation Forms',
      path: '/forms/validation'
    },
    {
      name: ' 精细化调价',
      path: '/forms/jingximanage'
    },
    {
      name:' 数据更新规则',
      path:'/forms/flightrefreshrule'
    },
    {
      name:' OTA接口验证',
      path:'/forms/otajiekou'
    },
    {
      name:' 直连配置',
      path:'/forms/zhilianpeizhi'
    },
    {
      name:' 平台配置',
      path:''
    },
    {
      name:' 航司行李配置',
      path:''
    }
    ]
  },
  {
    name: 'Table List',
    icon: 'ti-view-list-alt',
    collapsed: true,
    children: [{
      name: 'Regular Tables',
      path: '/table-list/regular'
    },
    {
      name: 'Extended Tables',
      path: '/table-list/extended'
    },
    {
      name: 'Paginated Tables',
      path: '/table-list/paginated'
    }
    ]
  },
  {
    name: '订单管理',
    icon: 'ti-map',
    children: [{
      name: '过票管理',
      path: '/maps/guopiao'
    },
    {
      name: '出票控制台',
      path: '/maps/chupiaocontrol'
    },
    {
      name: '订单查询',
      path: '/maps/dingdansearch'
    }
    ]
  },
  {
    name: 'Charts',
    icon: 'ti-gift',
    path: '/charts'
  },
  {
    name: 'Calendar',
    icon: 'ti-calendar',
    path: '/calendar'
  },
  {
    name: 'Pages',
    icon: 'ti-gift',
    children: [{
      name: 'User Page',
      path: '/pages/user'
    },
    {
      name: 'Timeline Page',
      path: '/pages/timeline'
    },
    {
      name: 'Login Page',
      path: '/login'
    },
    {
      name: 'Register Page',
      path: '/register'
    },
    {
      name: 'Lock Page',
      path: '/lock'
    }
    ]
  }
]
