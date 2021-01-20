import Vue from "vue";
import VueRouter from "vue-router";
import Router from "vue-router";
// store x
import store from "../store/index"
// import store from "src/store/index";
// import { basicRouterMap, routes } from "./router.config";
import { routes } from "./router.config";


Vue.use(Router);
const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  // routes: routerMap
  // routes:basicRouterMap
  routes
});
// var getRouter; // 用来获取后台拿到的路由

router.beforeEach((to, from, next) => {
  const access_token = localStorage.getItem("token");
  if(to.matched.some((name)=>name.meta.requireAuth)){
    if(access_token){
      console.log('登录成功11')
      next()
    }else{
      console.log('登录失败11111')
      next('/login')
    }   
  }else{
    next()
  }
  })

//   const access_token =
//     store.state.token || localStorage.getItem("Access-Token");
//   if (to.matched.some((name) => name.meta.requireAuth)) {
//     if (access_token) {
//       // 判断是否有token
//       if (to.path === "/login") {
//         next();
//       } else {
//         if (!getRouter) {
//           // 刷新页面
//           if (localStorage.getItem("User-Info")) {
//             const role = JSON.parse(localStorage.getItem("User-Info"))
//               .adminuser;
//             if (role) {
//               router.addRoutes(routes); // 动态添加管理员路由表
//               getRouter = JSON.stringify(routes);
//               localStorage.setItem("router", JSON.stringify(routes));
//             } 
//             // else {
//             //   router.addRoutes(routes); // 动态添加一般用户路由表
//             //   getRouter = JSON.stringify(routes);
//             //   localStorage.setItem("router", JSON.stringify(routes));
//             // }
//             next({ ...to, replace: true });
//           } else {
//             next("/login"); // 重定向到登录页
//           }
//         } else {
//           next();
//         }
//       }
//     } else {
//       if (to.path === "/login") {
//         next();
//       } else {
//         next("/login"); // 重定向到登录页
//       }
//     }
//   }else{
//     next()
//   }
// });
const originalPush=VueRouter.prototype.push
Router.prototype.push=function push(location){
  return originalPush.call(this,location).catch(err=>{
    err
  })
}
export default router
