import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import { basicRouterMap, asyncAdminerRouterMap, asyncConsumerRouterMap } from './router.config'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // routes: routerMap
  routes: basicRouterMap
});

var getRouter // 用来获取后台拿到的路由

router.beforeEach((to, from, next) => {
  // if (to.meta.title) { document.title = to.meta.title }

  const access_token = store.state.token || localStorage.getItem('Access-Token');
  if (access_token) { // 判断是否有token
    if (to.path === '/login') {
      next();
    } else {
      if (!getRouter) { // 刷新页面
        if (localStorage.getItem('User-Info')) {
          const role = JSON.parse(localStorage.getItem('User-Info')).adminuser;
          if (role) {
            router.addRoutes(asyncAdminerRouterMap); // 动态添加管理员路由表
            getRouter = JSON.stringify(asyncAdminerRouterMap);
            localStorage.setItem('router', JSON.stringify(asyncAdminerRouterMap));
          } else {
            router.addRoutes(asyncConsumerRouterMap); // 动态添加一般用户路由表
            getRouter = JSON.stringify(asyncAdminerRouterMap);
            localStorage.setItem('router', JSON.stringify(asyncConsumerRouterMap));
          }
          next({ ...to, replace: true });
        } else {
          next('/login'); // 重定向到登录页
        }
      } else {
        next();
      }
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next('/login'); // 重定向到登录页
    }
  }
});


export default router;
