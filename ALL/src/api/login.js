// import axios from 'axios';
import axios from '@/utils/request';

import { userServerIp } from '@/config/defaultSetting'

export function login (param) {
  return axios.post(`${userServerIp}/login`, param);
}
export function getSmsCode (param) {
  return axios.post(`${userServerIp}/sendSms`, param);
}
export function logout (param) {
  return axios.post(`${userServerIp}/logout`, param);
}
// 获取用户是否是超级管理员
export function userrole(param) {
  return axios.post(`${userServerIp}/getUserRole`, param);
}
