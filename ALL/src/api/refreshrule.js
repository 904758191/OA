// 自动调价
// import axios from 'axios';
import { serverIp } from '@/config/defaultSetting';
import axios from '@/utils/request';

// 根据ID获取内容
export function rulePointSelectOne(id) {
  return axios.get(`${serverIp}/refreshRule/rulePoint/${id}`);
}
export function ruleRangeSelectOne(id) {
  return axios.get(`${serverIp}/refreshRule/ruleRange/${id}`);
}
export function rulesSelectOne(id) {
  return axios.get(`${serverIp}/refreshRule/get/${id}`);
}
// 更新
export function ruleRangeUpdate(param) {
  return axios.post(`${serverIp}/refreshRule/ruleRange/update`, param);
}
export function rulePointUpdate(param) {
  return axios.post(`${serverIp}/refreshRule/rulePoint/update`, param);
}

export function refreshRuleUpdate(param) {
  return axios.post(`${serverIp}/refreshRule/update`, param);
}
// 新增
export function addTNRule(param) {
  return axios.post(`${serverIp}/refreshRule/add/rulePoint`, param);
}
export function addRuleRange(param) {
  return axios.post(`${serverIp}/refreshRule/add/ruleRange`, param);
}

export function addRefreshRule(param) {
  return axios.post(`${serverIp}/refreshRule/add`, param);
}

// 获取列表
export function rulePointGetList(param) {
  return axios.post(`${serverIp}/refreshRule/get/rulePoint`, param);
}
export function ruleRangeGetList(param) {
  return axios.post(`${serverIp}/refreshRule/get/ruleRange`, param);
}

export function refreshRuleGetList(param) {
  return axios.post(`${serverIp}/refreshRule/get`, param);
}
// 修改状态
export function autoPriceChangeState(param) {
  return axios.post(`${serverIp}/autoAdjustPrice/updateState`, param);
}
export function rulePointDelete(id) {
  return axios.get(`${serverIp}/refreshRule/del/rulePoint/${id}`);
}
export function ruleRangeDelete(id) {
  return axios.get(`${serverIp}/refreshRule/del/ruleRange/${id}`);
}

export function refreshRuleDelete(id) {
  return axios.get(`${serverIp}/refreshRule/del/${id}`);
}
export function flightWarningList(param) {
  return axios.post(`${serverIp}/refreshRule/get/warning`, param);
}

export function flightWarningIgnore(param) {
  return axios.post(`${serverIp}/refreshRule/warning/ignore`, param);
}
