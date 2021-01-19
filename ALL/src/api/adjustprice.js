// 调价
// import axios from 'axios';
import { serverIp } from '@/config/defaultSetting';
import axios from '@/utils/request';

// 根据ID获取内容
export function adpriceGet(param) {
  return axios.get(`${serverIp}/api/adjustPrice/selectOne`, {
    params: param
  });
}
// 更新
export function adpriceUpdate(param) {
  return axios.post(`${serverIp}/api/adjustPrice/update`, param);
}
// 删除
export function adpriceDelete(param) {
  return axios.post(`${serverIp}/api/adjustPrice/delete`, param);
}
// 新增
export function adpriceAdd(param) {
  return axios.post(`${serverIp}/api/adjustPrice/add`, param);
}
// 获取列表
export function adpriceGetList(param) {
  return axios.post(`${serverIp}/api/adjustPrice/select`, param);
}
// 批量更新
export function adpriceBatchUpdate(param) {
  return axios.post(`${serverIp}/api/adjustPrice/batchUpdate`, param);
}
// 上传文件
export function adpriceUploadFile(datasrc, formdata) {
  return axios({
    method: 'POST',
    url: `${serverIp}/report/adjustPrice/uploadFile?src=${datasrc}`,
    data: formdata
  })
}

// 下载模版
export function adpriceDownloadTemplet() {
  return axios.get(`${serverIp}/report/adjustPrice/downloadTemplet`, {
    responseType: 'blob'
  });
}
// 导出数据
export function adpriceExportFile(query) {
  return axios.get(`${serverIp}/report/adjustPrice/exportFile?${query}`, {
    responseType: 'blob'
  });
}
