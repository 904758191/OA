export function  qryobj(){
  var theRequest = new Object();
  if (location.search.indexOf("?") != -1) {
      var str = this.substr(1);
      strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
  }
  return theRequest;
}
export function dataGet(qry, app) {
  // console.log(qry);
  axios.get('/api/order/orderInfo/' + qry.orderNo).then(rtn => {
      // rtn.data.segs.sort((x, y) => x.data.datDep > y.data.datDep ? 1 : -1)
      rtn.data.segs.sort(by('timeDep', 'data', 1, by('pName', 'data', 1, '')))
      console.log(rtn.data.flightDepChng)
      console.log(rtn.data)
          //提取成人姓名 添加婴儿用
      app.adultNames = Array.from(new Set(rtn.data.segs.filter(s => s.data.ageType == "成人").map(s => s.data.pName)));

      //给添加婴儿对象的orderNo字段赋值
      app.extraBabyNew.orderNo = rtn.data.segs[0].data.orderNo;
      app.extraBabyNew.airCo = rtn.data.segs[0].data.airCo;
      app.extraBabyNew.route = rtn.data.segs[0].data.route;
      if (app.adultNames.length > 0) {
          app.extraBabyNew.parentName4Chd = app.adultNames[0]
      }

      app.segs = rtn.data.segs;
      if (app.configs.rcvAccts && app.configs.rcvAccts.filter(x => x.src == app.segs[0].data.src).length > 0) {
          app.configs.rcvAccts = app.configs.rcvAccts.filter(x => x.src == app.segs[0].data.src)[0].accts
      }

      app.segs.forEach(x => x.isCheck = false);

      app.segs.map(function(x) {
          if (x.data.bag) {
              x.data.bag = (x.data.bag + '').replace('kg', '') + 'kg'
          }
          if (x.data.bagPrice == 0) {
              x.data.bagPrice = ''
          }
          if (x.data.profitJp == 0) {
              x.data.profitJp = ''
          }
          if (x.data.profitExtra == 0) {
              x.data.profitExtra = ''
          }
          if (x.data.tktIssuePrice == 0) {
              x.data.tktIssuePrice = ''
          }
          if (x.data.tktIssuePriceFrn == 0) {
              x.data.tktIssuePriceFrn = ''
          }
          x.data.airCoYinShou = x.data.tktIssuePrice
          x.data.psgrYinFu = parseFloat(x.data.price) + parseFloat(x.data.tax)


          //做个对比标识，将seg中的行程提取到routes中
          x.data.routeCompare = x.data.datDep + x.data.flightNo
          if (app.routes.filter(r => r.routeCompare == x.data.routeCompare).length == 0) {
              app.routes.push(x.data)
          }
          app.routes.forEach(x => {
              if (x.price != '') x.price = new Number(x.price).toFixed(2);
              if (x.tax != '') x.tax = new Number(x.tax).toFixed(2);
          })
          if (["待出票", "出票完成", "改签中"].includes(x.data.segStat)) {
              ['行李', '餐食', '值机'].map(function(ctg) {
                  if (rtn.data.segExtra.filter(e => e.segid == x.id && e.data.ctg == ctg).length == 0) {
                      rtn.data.segExtra.push(extraItemCreate(x.id, x.data.src, x.data.airCo, x.orderno, x.data.route, x.data.pName, x.data.segStat, ctg))
                  } else {
                      rtn.data.segExtra.filter(e => e.segid == x.id && e.data.ctg == ctg)[0].data.segStat = x.data.segStat;
                  }
              })
          }
      })


      app.segExtra = rtn.data.segExtra;

      app.segExtra.forEach(x => x.isCheck = false)

      // rtn.data.routes.sort((x, y) => x.datDep > y.datDep ? 1 : -1)
      // //可能更换航班号
      // rtn.data.routes.filter(x => x.route == rtn.data.segs[0].data.route)[0].flightNo = rtn.data.segs[0].data.flightNo
      // if (rtn.data.routes.length > 1) {
      //     rtn.data.routes.filter(x => x.route == rtn.data.segs[rtn.data.segs.length - 1].data.route)[0].flightNo = rtn.data.segs[rtn.data.segs.length - 1].data.flightNo
      // }
      // app.routes = rtn.data.routes;

      app.oper = rtn.data.oper;

      rtn.data.order.logs.sort((x, y) => x.dat > y.dat ? -1 : 1)

      rtn.data.order.data.rmkOld = rtn.data.order.data.rmk;
      rtn.data.order.data.id = rtn.data.order.id;
      app.order = rtn.data.order;

      app.logs = rtn.data.order.logs.filter(x => x.ctg != '查看')

      if (app.segs.filter(x => x.data.segStat === '已取消').length > 0) {
          layer.alert('有航段已取消')
      }

      app.chngsegs = rtn.data.segs;
      app.bags = rtn.data.bags;

      app.flightDepchng = rtn.data.flightDepChng;



      rtn.data.extra.sort((x, y) => x.dat > y.dat ? -1 : 1)
      app.extra = rtn.data.extra;

      app.peoples = [];
      app.segs.map(seg => {
          seg.data.gaiqiInfo = {
                  timeDepOld: seg.data.timeDep,
                  timeArrOld: seg.data.timeArr,
                  flightNoOld: seg.data.flightNo,
                  cabinOld: seg.data.cabin,
                  priceOld: seg.data.price,
                  taxOld: seg.data.tax,

                  stat: "",

                  rcv: "",
                  rcvAcct: "",
                  rcvTime: "",
                  rcvOper: "",
                  rcvSerial: "",
                  pay: "",
                  payAcct: "",
                  payTime: "",
                  payOper: "",
                  paySerial: "",
                  payChannel: "",
                  airCoAR: "",
              }
              // seg.data.newoilFee = seg.data.oilFee;

          app.times.push({
              "segid": seg.id,
              "dep": seg.data.timeDep,
              "arr": seg.data.timeArr
          });

          let tmp = {
              id: 0,
              segid: seg.id,
              data: {
                  orderNo: seg.orderno,
                  pName: seg.data.pName,
                  pNameOld: seg.data.pName,
                  ageType: seg.data.ageType,
                  ageTypeOld: seg.data.ageType,
                  gender: seg.data.gender,
                  genderOld: seg.data.gender,
                  nation: seg.data.nation,
                  nationOld: seg.data.nation,
                  birthday: seg.data.birthday,
                  birthdayOld: seg.data.birthday,
                  idType: seg.data.idType,
                  idTypeOld: seg.data.idType,
                  idNo: seg.data.idNo,
                  idNoOld: seg.data.idNo,
                  idExpire: seg.data.idExpire,
                  idExpireOld: seg.data.idExpire,

                  src: seg.data.src,
                  airCo: seg.data.airCo,
                  route: seg.data.route,
                  extraNo: "",

                  ctg: "改名",
                  stat: "待处理",
                  segStat: seg.data.segStat,

                  item: seg.data.pName,

                  rcv: "",
                  rcvAcct: "",
                  rcvSerial: "",
                  rcvTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                  rcvOper: "",

                  pay: "",
                  payAcct: "",
                  paySerial: "",
                  payChannel: "",
                  payTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                  payOper: "",
              }
          };

          let his = rtn.data.segExtra.filter(ext => ext.data.ctg == "改名" && ext.data.pName == tmp.data.pName)
          if (his.length) {
              tmp.id = his.map(x => x.id)[0];
              tmp.data.rcv = his[0].data.rcv;
              tmp.data.rcvAcct = his[0].data.rcvAcct;
              tmp.data.rcvSerial = his[0].data.rcvSerial;
              tmp.data.rcvTime = his[0].data.rcvTime;
              tmp.data.rcvOper = his[0].data.rcvOper;
              tmp.data.pay = his[0].data.pay;
              tmp.data.payAcct = his[0].data.payAcct;
              tmp.data.paySerial = his[0].data.paySerial;
              tmp.data.payChannel = his[0].data.payChannel;
              tmp.data.payTime = his[0].data.payTime;
              tmp.data.payOper = his[0].data.payOper;
          }

          // if (app.peoples.length == 0) {
          //     app.peoples.push(tmp);
          // } else {
          //     if (app.peoples.filter(x => x.pName == pName).length == 0) {
          //         app.peoples.push(tmp);
          //     } else {
          //         var t = app.peoples.filter(x => x.pName == pName)[0];
          //         t.segIds.push(seg.id);
          //     }
          // }
          if (app.peoples.filter(p => p.data.pName == seg.data.pName).length == 0) {
              app.peoples.push(tmp)
          }
      });
  })
}