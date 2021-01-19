// 用户管理接口
import { userServerIp } from '@/config/defaultSetting'
import axios from '@/utils/request';

// 根据ID获取内容
export function userGet(param) {
  return axios.post(`${userServerIp}/getUser`, param);
}
// 新增
export function userAdd(param) {
  return axios.post(`${userServerIp}/addUser`, param);
}
// 获取列表
export function userGetList(param) {
  return axios.post(`${userServerIp}/getAllUser`, param);
}
