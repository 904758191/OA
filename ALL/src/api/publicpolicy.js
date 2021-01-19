// 直连数据接口
// import axios from 'axios';
import { serverIp, sjhIp, lutingIp } from '@/config/defaultSetting';
import axios from '@/utils/request';

// 根据stockID获取未支付座位
export function getUnPaySeatCount(param) {
  return axios.post(`http://139.224.186.136:8022/stock/unPaySeatCount`, param);
  // return axios.post(`${lutingIp}/stock/unPaySeatCount`, param);
}

// 根据ID获取内容
export function policyGet(param, destination = '') {
  param.destination = destination;
  return axios.get(`${serverIp}/api/publicPolicy/selectOne`, {
    params: param
  });
}
// 更新
export function policyUpdate(param, destination = '') {
  param.destination = destination;
  return axios.post(`${serverIp}/api/publicPolicy/update`, param);
}
// 删除
export function policyDelete(param, destination = '') {
  param.destination = destination;
  return axios.post(`${serverIp}/api/publicPolicy/delete`, param);
}
// 新增
export function policyAdd(param, destination = '') {
  param.destination = destination;
  return axios.post(`${serverIp}/api/publicPolicy/add`, param);
}
// 获取列表
export function policyGetList(param, destination = '') {
  param.param.destination = destination;
  return axios.post(`${serverIp}/api/publicPolicy/select`, param);
}
// 批量更新
export function policyBatchUpdate(param, destination = '') {
  param.param.destination = destination;
  return axios.post(`${serverIp}/api/publicPolicy/batchUpdate`, param);
}
// 上传文件
export function policyUploadFile(formdata, destination = '') {
  return axios({
    method: 'POST',
    url: `${serverIp}/report/publicPolicy/uploadFile?destination=${destination}`,
    data: formdata
  })
}
// 下载模版
export function policyDownloadTemplet() {
  return axios.get(`${serverIp}/report/publicPolicy/downloadTemplet`, {
    responseType: 'blob'
  });
}
// 导出数据
export function policyExportFile(query) {
  return axios.get(`${serverIp}/report/publicPolicy/exportFile?${query}`, {
    responseType: 'blob'
  });
}

// 直连数据关联政策
export function policyPriceGet(param, destination = '') {
  // param.param.destination = destination;
  // return axios.post(`${sjhIp}/api/getplatformsprice`, param);
  return axios.post(`${sjhIp}/api/searchprice`, param);
}
