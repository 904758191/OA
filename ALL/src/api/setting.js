// 基本配置
// import axios from 'axios';
import { serverIp, lutingIp, userServerIp } from '@/config/defaultSetting';
import axios from '@/utils/request';

/*
 * 行李设置
 */
// 新增
export function baggageAdd(param) {
  return axios.post(`${serverIp}/config/baggageConf/add`, param);
}
// 获取列表
export function baggageGetList() {
  return axios.get(`${serverIp}/config/baggageConf/selectAll`);
}

/*
 * 黑名单设置
 */
export function blackListAdd(param) {
  return axios.post(`${serverIp}/config/blacklist/add`, param);
}
export function blackListGet() {
  return axios.get(`${serverIp}/config/blacklist/select`);
}

/*
 * 库存信息提醒
 */
export function stockMonitorAdd(param) {
  return axios.post(`${lutingIp}/stock/monitor/insert`, param);
}
export function stockMonitorUpdate(param) {
  return axios.post(`${lutingIp}/stock/monitor/update`, param);
}
export function stockMonitorSelect(param) {
  return axios.post(`${lutingIp}/stock/monitor/select`, param);
}
export function stockMonitorDelete(param) {
  return axios.post(`${lutingIp}/stock/monitor/delete`, param);
}


/*
 * 统一配置
 */
export function unifiedUpdate(param) {
  return axios.post(`${userServerIp}/setConfigName`, param);
}
export function unifiedGet(param) {
  return axios.post(`${userServerIp}/getConfigName`, param);
}
