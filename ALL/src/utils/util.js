import _ from 'underscore'

// 对象中字符串值trim()
export function objectTrim(obj) {
  let tmpobj = _.clone(obj);
  let result = _.mapObject(tmpobj, (v, k) => {
    if (_.isString(v)) {
      return v.trim();
    } else {
      return v;
    }
  });
  return result
}

// 对象中去除空字符串
export function objectDeleteEmptyString(obj) {
  let tmpobj = _.clone(obj);
  let result = _.mapObject(tmpobj, (v, k, obj) => {
    if (!v) {
      delete obj[k];
    } else {
      return v;
    }
  });
  return result
}

// 删除没有值的属性
export function compactObject(obj) {
  var clone = _.clone(obj);
  _.each(clone, (v, k) => {
    if (!v && v !== 0) {
      delete clone[k];
    }
  });
  return clone;
}

// 验证手机号码
export function mobileCheck(mobile) {
  return /^1[345789]\d{9}$/.test(mobile);
}

// 时间范围选择器格式整理
export function rangePickToArr(inv, format = 'YYYYMMDD') {
  let start = inv[0].format(format);
  let end = inv[1].format(format);
  return [start, end];
}

// diff 差异化两个对象
export function objectDiff(leftobj = {}, rightobj = {}) {
  const result = _.chain(leftobj).pairs().map(([k, v]) => {
    if (rightobj[k] == v || _.isArray(v)) {
      return 0;
    } else {
      return [k, v]
    }
  }).filter(v => {
    return !!v;
  }).object().value();
  return result;
}

// 时间格式化
export function dateFormat(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(1000*date)
  }
  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 下载excel到本地 data为blob对象
export function downloadExcel(data, savename = 'adjustprice.xlsx') {
    if (!data) { return; }
    let url = window.URL.createObjectURL(new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    }));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', savename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 验证权限
export function permissionVerify(permission, depAirport, arrAirport, fromCarrier, retCarrier) {
  if (!permission) { // 没有权限直接返回false
    return false;
  }
  let temparr = permission.split(';');
  let permission_format = _.chain(temparr).map(v => {
    let hs = v.split('/')[0];
    let hx = v.split('/')[1].split('-');
    return { hs: hs, hx: hx, }
  }).value();

  let res = _.chain(permission_format).find(v => {
    if (retCarrier) {
      if (v.hs === retCarrier && v.hx[0] === depAirport && v.hx[1] === arrAirport ) {
        if (v.hs === fromCarrier && v.hx[0] === depAirport && v.hx[1] === arrAirport ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      if (v.hs === fromCarrier && v.hx[0] === depAirport && v.hx[1] === arrAirport ) {
        return true;
      } else {
        return false;
      }
    }
  }).value();
  return !!res;
}

