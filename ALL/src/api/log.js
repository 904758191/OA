// 日志接口
// import axios from 'axios';
import { userServerIp } from '@/config/defaultSetting'
import axios from '@/utils/request';

// 根据ID获取内容
export function logList(param) {
  return axios.post(`${userServerIp}/Log/getLogSrcData`, param);
}
export function getDeleteLogList(param) {
  return axios.post(`${userServerIp}/Log/getLogDeleteData`, param);
}