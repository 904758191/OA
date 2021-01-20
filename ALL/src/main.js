import Vue from 'vue'
import './pollyfills'
import VueRouter from 'vue-router'
import VueNotify from 'vue-notifyjs'
import VeeValidate from 'vee-validate'
import Element from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import App from './App.vue'
import $ from 'jquery'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import layer from 'vue-layer'
Vue.prototype.$layer=layer(Vue)
Vue.prototype.$ajax=axios
// 运价管理基础路径
// axios.defaults.baseURL = "http://192.168.31.183:8082";
axios.defaults.timeout = 3000;
// 运价管理基础路径
axios.defaults.baseURL="http://192.168.31.174:12679"
// axios.defaults.baseURL="http://localhost"
// axios.defaults.withCredentials=true
// axios.defaults.headers['Authorization'] = "Bearer " + window.localStorage["token"];
axios.interceptors.request.use(request=>{
  let token= window.localStorage["token"]
  if(token){
    request.headers.authorization="Bearer " +token
  }
  return request
},error=>{})
Vue.use(Element)

Vue.use(Vueaxios,axios)
// Plugins
import GlobalComponents from './gloablComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/UIComponents/SidebarPlugin'

// router setup
import routes from './routes/routes'
// 新增配置
import router from './router'
// import store from './store'

// library imports

import './assets/sass/paper-dashboard.scss'
import './assets/sass/element_variables.scss'
import './assets/sass/demo.scss'

// 加载侧边栏
import sidebarLinks from './sidebarLinks'

import './utils/util'

// 添加后
import Antd from 'ant-design-vue'
import store from './store'
// import router from './router'

const config={
  errorBagNameL:'errorBags',
  fieldsBagName:'fieldBags'
}
// plugin setup
Vue.use(VueRouter)
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
Vue.use(SideBar, {sidebarLinks: sidebarLinks})
Vue.use(VeeValidate,config)
locale.use(lang)
Vue.use(Antd)

// configure router
// const router = new VueRouter({
//   routes, // short for routes: routes
//   linkActiveClass: 'active'
// })

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App),
  
})
