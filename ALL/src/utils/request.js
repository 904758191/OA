import axios from 'axios'
import store from '@/store/index'
import notification from 'ant-design-vue/es/notification'

// axios.defaults.timeout = 10000;

// request interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('Access-Token');
  if (token) {
    config.headers.Authorization = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
axios.interceptors.response.use((response) => {
  if (response.data.state == 4011) {
    store.commit('SET_TOKEN', '')
    store.commit('SET_USERINFO', {})
    localStorage.removeItem('Access-Token'); 
    localStorage.removeItem('Expire'); 
    localStorage.removeItem('User-Info'); 
    localStorage.removeItem('router'); 
    notification.error({
      message: '登陆过期',
      description: '请重新登陆'
    });
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  }
  return response.data
}, err)


function err(error) {
  if (error.response) {
    const data = error.response.data;
    const token = localStorage.getItem('Access-Token');
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

export default axios