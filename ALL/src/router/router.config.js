import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'
// Dashboard pages
import Overview from 'src/components/Dashboard/Views/Dashboard/Overview.vue'
import Stats from 'src/components/Dashboard/Views/Dashboard/Stats.vue'

// Pages
import User from 'src/components/Dashboard/Views/Pages/UserProfile.vue'
import TimeLine from 'src/components/Dashboard/Views/Pages/TimeLinePage.vue'
import Login from 'src/components/Dashboard/Views/Pages/Login.vue'
import Register from 'src/components/Dashboard/Views/Pages/Register.vue'
import Lock from 'src/components/Dashboard/Views/Pages/Lock.vue'

// Components pages
import Buttons from 'src/components/Dashboard/Views/Components/Buttons.vue'
import GridSystem from 'src/components/Dashboard/Views/Components/GridSystem.vue'
import Panels from 'src/components/Dashboard/Views/Components/Panels.vue'
import SweetAlert from 'src/components/Dashboard/Views/Components/SweetAlert.vue'
import Notifications from 'src/components/Dashboard/Views/Components/Notifications.vue'
import Icons from 'src/components/Dashboard/Views/Components/Icons.vue'
import Typography from 'src/components/Dashboard/Views/Components/Typography.vue'

// Forms pages
// 精细化调价
import JingXiManage from 'src/components/Dashboard/Views/Forms/JingXiManage.vue'
// TF数据
import TFDate from 'src/components/Dashboard/Views/Forms/TFDate.vue'
// 点击TF数据跳转的页面
import ValidationForms from 'src/components/Dashboard/Views/Forms/ValidationForms.vue'
// 航班数据
import HangbanDate from 'src/components/Dashboard/Views/Forms/HangBanShuJu.vue'
// 直连设置
import ZhiLianPeiZhi from 'src/components/Dashboard/Views/Forms/zhilianpeizhi.vue'


// 数据更新规则
import FlightRefreshRule from 'src/components/Dashboard/Views/Forms/FlightRefreshRule.vue'
// OTA接口验证
import OTAJieKou from 'src/components/Dashboard/Views/Forms/OTAJieKou.vue'
// 航司行李配置
// import HangSiPeiZhi from 'src/components/Dashboard/Views/Forms/HangSiPeiZhi.vue'
// form表单跳转路由
import tankuangHangbandate from 'src/components/Dashboard/Views/Forms/tankuang/hangbandata_new.vue'
import tankuangHangbandate_table from 'src/components/Dashboard/Views/Forms/tankuang/hangbandata_table_edit.vue'


// TableList pages
import RegularTables from 'src/components/Dashboard/Views/Tables/RegularTables.vue'
import ExtendedTables from 'src/components/Dashboard/Views/Tables/ExtendedTables.vue'
import PaginatedTables from 'src/components/Dashboard/Views/Tables/PaginatedTables.vue'
import AddData from 'src/components/Dashboard/Views/Tables/AddData.vue'
// order 订单信息 pages
import guopiaoSearch from 'src/components/Dashboard/Views/Maps/guopiao.vue'
import chupiaoControl from 'src/components/Dashboard/Views/Maps/chupiaoControl.vue'
import dingdanSearch from 'src/components/Dashboard/Views/Maps/dingdanSearch.vue'

// 订单信息跳转路由
// 表格中的渠道订单号跳转
import orderInfo from 'src/components/Dashboard/Views/Maps/tankuang/orderInfo.vue'
// 表格中的航段航班号跳转
import storeSummary from 'src/components/Dashboard/Views/Maps/tankuang/storesummary.vue'
// 出票控制台路由
// 表格ID跳转
import tktissueShow from 'src/components/Dashboard/views/Maps/tankuang/tktissueshow.vue' 
// Calendar
import Calendar from 'src/components/Dashboard/Views/Calendar/CalendarRoute.vue'
// Charts
import Charts from 'src/components/Dashboard/Views/Charts.vue'

let componentsMenu = {
  path: '/components',
  component: DashboardLayout,
  redirect: '/components/buttons',
  children: [
    {
      path: 'buttons',
      name: 'Buttons',
      meta:{
        requireAuth:true
      },
      component: Buttons
    },
    {
      path: 'grid-system',
      name: 'Grid System',
      meta:{
        requireAuth:true
      },
      component: GridSystem
    },
    {
      path: 'panels',
      name: 'Panels',
      meta:{
        requireAuth:true
      },
      component: Panels
    },
    {
      path: 'sweet-alert',
      name: 'Sweet Alert',
      meta:{
        requireAuth:true
      },
      component: SweetAlert
    },
    {
      path: 'notifications',
      name: 'Notifications',
      meta:{
        requireAuth:true
      },
      component: Notifications
    },
    {
      path: 'icons',
      name: 'Icons',
      meta:{
        requireAuth:true
      },
      component: Icons
    },
    {
      path: 'typography',
      name: 'Typography',
      meta:{
        requireAuth:true
      },
      component: Typography
    }

  ]
}
let formsMenu = {
  path: '/forms',
  component: DashboardLayout,
  redirect: '/forms/regular',
  children: [
    {
      path: 'jingximanage',
      name: 'JingXiManage',
      meta:{
        requireAuth:true
      },
      component: JingXiManage
    },
    {
      path: 'tfdate',
      name: 'TFDate',
      meta:{
        requireAuth:true
      },
      component: TFDate
    },
    {
      path: 'validation',
      name: 'Validation Forms',
      meta:{
        requireAuth:true
      },
      component: ValidationForms
    },
    {
      path: 'hangbandate',
      name: 'hangbandate',
      meta:{
        requireAuth:true
      },
      component: HangbanDate
    },
    // 直连设置
    {
      path: 'zhilianpeizhi',
      name: 'zhilianpeizhi',
      meta:{
        requireAuth:true
      },
      component: ZhiLianPeiZhi
    },
    {
      path:'flightrefreshrule',
      name:'Flightrefreshrule',
      meta:{
        requireAuth:true
      },
      component:FlightRefreshRule
    },
    {
      path:'otajiekou',
      name:'OTAjiekou',
      meta:{
        requireAuth:true
      },
      component:OTAJieKou
    },
    // {
    //   path:'hangsipeizhi',
    //   name:'hangsipeizhi',
    //   meta:{
    //     requireAuth:true
    //   },
    //   component:HangSiPeiZhi
    // },
    {
      path:'tankuang/hangbandata_new',
      name:'tankuang/hangbandata_new',
      meta:{
        requireAuth:true
      },
      component:tankuangHangbandate
    },
    {
      path:'tankuang/hangbandata_table_edit',
      name:'tankuang/hangbandata_table_edit',
      meta:{
        requireAuth:true
      },
      component:tankuangHangbandate_table
    }
  ]
}

let tablesMenu = {
  path: '/table-list',
  component: DashboardLayout,
  redirect: '/table-list/regular',
  children: [
    {
      path: 'regular',
      name: 'Regular Tables',
      meta:{
        requireAuth:true
      },
      component: RegularTables
    },
    {
      path: 'extended',
      name: 'Extended Tables',
      meta:{
        requireAuth:true
      },
      component: ExtendedTables
    },
    {
      path: 'paginated',
      name: 'Paginated Tables',
      meta:{
        requireAuth:true
      },
      component: PaginatedTables
    },
    {
      path:'adddata',
      name:'AddData',
      meta:{
        requireAuth:true
      },
      component:AddData
    }]
}

let mapsMenu = {
  path: '/maps',
  component: DashboardLayout,
  redirect: '/maps/guopiao',
  children: [
    {
      path: 'guopiao',
      name: 'guopiao',
      meta:{
        requireAuth:true
      },
      component: guopiaoSearch
    },
    {
      path: 'chupiaocontrol',
      name: 'chupiaocontrol',
      meta:{
        requireAuth:true
      },
      component: chupiaoControl
    },
    {
      path: 'dingdansearch',
      name: 'dingdansearch',
      meta:{
        requireAuth:true
      },
      component: dingdanSearch
    },
    {
      path:'tankuang/orderInfo',
      name:'tankuang/orderInfo',
      meta:{
        requireAuth:true
      },
      component:orderInfo
    },
    {
      path:'tankuang/storesummary',
      name:'tankuang/storesummary',
      meta:{
        requireAuth:true
      },
      component:storeSummary
    },
    {
      path:'tankuang/tktissueshow',
      name:'tankuang/tktissueshow',
      meta:{
        requireAuth:true
      },
      component:tktissueShow
    }
  ]
}

let pagesMenu = {
  path: '/pages',
  component: DashboardLayout,
  redirect: '/pages/user',
  children: [
    {
      path: 'user',
      name: 'User Page',
      meta:{
        requireAuth:true
      },
      component: User
    },
    {
      path: 'timeline',
      name: 'Timeline Page',
      meta:{
        requireAuth:true
      },
      component: TimeLine
    }
  ]
}

let loginPage = {
  path: '/login',
  name: 'Login',
  component: Login,
  // redirect:'/login',
}

let registerPage = {
  path: '/register',
  name: 'Register',
  meta:{
    requireAuth:true
  },
  component: Register,
}

let lockPage = {
  path: '/lock',
  name: 'Lock',
  meta:{
    requireAuth:true
  },
  component: Lock
}

export const routes = [
  {
    path:'/',
    // name:'login',
    components:DashboardLayout,
    redirect:'/login'
  },
  loginPage,
  {
    path: '/admin/overview',
    component: DashboardLayout,
    children: [
      {
        path: 'calendar',
        name: 'Calendar',
        meta:{
          requireAuth:true
        },
        component: Calendar
      },
      {
        path: 'charts',
        name: 'Charts',
        meta:{
          requireAuth:true
        },
        component: Charts
      }
    ]
  },
  componentsMenu,
  formsMenu,
  tablesMenu,
  mapsMenu,
  pagesMenu,
  registerPage,
  lockPage,
  {
    path: '/admin',
    component: DashboardLayout,
    // redirect: '/admin/overview',
    redirect:'/',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        meta:{
          requireAuth:true
        },
        component: Overview
      },
      {
        path: 'stats',
        name: 'Stats',
        meta:{
          requireAuth:true
        },
        component: Stats
      }
    ]
  },
  {path: '*', component: NotFound}
]

// export const basicRouterMap = [{
//   path: '/login',
//   name: 'login',
//   component: (resolve) => require(['src/components/Dashboard/Views/Pages/Login.vue'], resolve)
// },
// {
//   path: '/',
//   name: 'nopath',
//   component: (resolve) => require(['@/views/user/Login'], resolve)
// }
// ];