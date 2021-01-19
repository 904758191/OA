// 舱位管理
// import axios from 'axios';
import { serverIp } from '@/config/defaultSetting';
import axios from '@/utils/request';

/*
* 舱位设置
*/
// 新增
export function cabinAdd(param) {
  return axios.post(`${serverIp}/config/cabinPrice/add`, param);
}
// 更新
export function cabinUpdate(param) {
  return axios.post(`${serverIp}/config/cabinPrice/update`, param);
}
// 获取列表
export function cabinGetList(param) {
  return axios.post(`${serverIp}/config/cabinPrice/selectAll`, param);
}
// 获取单条记录
export function cabinGetOne(id) {
  return axios.get(`${serverIp}/config/cabinPrice/selectOne?id=${id}`);
}
