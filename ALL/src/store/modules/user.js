
// 判断页面是否存在token
import { login, logout, userrole } from '@/api/login'
const user = {
  state: {
    token: '',
    userinfo: {}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userinfo) => {
      state.userinfo = userinfo;
    },
  },
  actions: {
    // 登陆
    Login({ commit }, loginInfo) {
      return new Promise((resolve, reject) => {
        login(loginInfo).then(res => {
          if (!res.state) {
            // userrole()
            localStorage.setItem('Access-Token', res.data.user.token);
            localStorage.setItem('Expire', new Date().getTime() + 12*60*60*1000);
            localStorage.setItem('User-Info', JSON.stringify(res.data.user));
            commit('SET_TOKEN', res.data.user.token);
            commit('SET_USERINFO', res.data.user);
            resolve();
          } else {
            reject('登陆失败');
          }
        }).catch(err => {
          reject('登陆失败');
        })
      })
    },
    // 登出
    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then((res) => {
          if (!res.state) {
            commit('SET_TOKEN', '')
            commit('SET_USERINFO', {})
            localStorage.removeItem('Access-Token'); 
            localStorage.removeItem('Expire'); 
            localStorage.removeItem('User-Info'); 
            localStorage.removeItem('router'); 
            resolve();
          } else {
            reject();
          }
        }).catch((err) => {
          reject(err);
        })
      })
    }
  },
  getters: {
    userinfo: state => state.userinfo
  }
}

export default user