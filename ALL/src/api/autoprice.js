// 自动调价
// import axios from 'axios';
import { serverIp } from '@/config/defaultSetting';
import axios from '@/utils/request';

// 根据ID获取内容
export function autoPriceSelectOne(param) {
  return axios.get(`${serverIp}/autoAdjustPrice/selectOne`, {
    params: param
  });
}
// 更新
export function autoPriceUpdate(param) {
  return axios.post(`${serverIp}/autoAdjustPrice/update`, param);
}
// 新增
export function autoPriceAdd(param) {
  return axios.post(`${serverIp}/autoAdjustPrice/add`, param);
}
// 获取列表
export function autoPriceGetList(param) {
  return axios.post(`${serverIp}/autoAdjustPrice/select`, param);
}
// 修改状态
export function autoPriceChangeState(param) {
  return axios.post(`${serverIp}/autoAdjustPrice/updateState`, param);
}
export function autoPriceDelete(id) {
  return axios.get(`${serverIp}/autoAdjustPrice/delete/${id}`);
}


// 自动调价结果
// 获取列表
export function autoPriceResultList(param) {
  return axios.post(`${serverIp}/comparePrice/select`, param);
}
// 自动调价预警列表
export function autoPriceWarningExportFile(query) {
  return axios.get(`${serverIp}/report/warning/exportFile${query}`, {
    responseType: 'blob'
  });
}
export function autoPriceWarningList(param) {
  return axios.post(`${serverIp}/adjustPriceMonitor/select`, param);
}
export function autoPriceWarningDelete(param) {
  return axios.post(`${serverIp}/adjustPriceMonitor/delete`, param);
}
export function autoPriceWarningIgnore(param) {
  return axios.post(`${serverIp}/adjustPriceMonitor/ignore`, param);
}
export function autoPriceConfig(param) {
  return axios.post(`${serverIp}/adjustPriceMonitor/setConfig`, param);
}
export function autoPriceGetConfig() {
  return axios.get(`${serverIp}/adjustPriceMonitor/getConfig`);
}


