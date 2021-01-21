<template>
  <div>
    <div>
      <form @submit.prevent="search">
        <!-- <input type="text" v-model="qry.pnr" placeholder="PNR" /> -->
        <input type="text"  placeholder="航司" />
        <input type="text"  placeholder="航段" />
        <input type="text"   placeholder="航班号" />
        <el-date-picker style="width: 140px;" value-format="yyyy-MM-dd"  type="date" size="mini"
          placeholder="起飞日期"></el-date-picker>
        <span>临团状态:</span>
        <select id="sendSybol" >
          <option v-for="(s,index) in teamStats" :key="index">{{ s }}</option>
        </select>
        <input type="checkbox"  id="notDep" />
        <label for="notDep">仅显示未起飞</label>
        <input type="checkbox"  id="onlyStore" />
        <label for="onlyStore">仅显示有库存</label>
        <input type="submit" value="查询" />
        <input type="button" value="导出" @click="ep()" v-if="configs.operAuth.includes('库存总览导出')" />
      </form>

      <!-- <form
        id="form2"
        action="/api/api/storeSummaryExport"
        target="_blank"
        method="POST"
      >
        <input type="hidden" name="pnr" v-model="qry.pnr" />
        <input type="hidden" name="airCo" v-model="qry.airCo" />
        <input type="hidden" name="route" v-model="qry.route" />
        <input type="hidden" name="flightNo" v-model="qry.flightNo" />
        <input type="hidden" name="datDep" v-model="qry.datDep" />
        <input type="hidden" name="teamStat" v-model="qry.teamStat" />
        <input type="hidden" name="notDep" v-model="qry.notDep" />
        <input type="hidden" name="onlyStore" v-model="qry.onlyStore" />
        <input type="hidden" name="token" id="token" />
      </form> -->
    </div>
    <!-- <div style="margin:10px 0px;float: left;">
      <table class="mytable">
        <thead>
          <tr>
            <th>航段</th>
            <th style="cursor:pointer;color:blue;" @click="sortDepGo">
              起飞日期
            </th>
            <th>星期</th>
            <th>航班号</th>
            <th>全</th>
            <th>临团状态</th>
            <th>库存</th>
            <th>已收</th>
            <th>预收</th>
            <th>已出票</th>
            <th>出票中</th>
            <th style="cursor:pointer;color:blue;" @click="sortShengYuGo">
              剩余
            </th>
            <th>总收单</th>
            <th>间隔</th>
            <th>&nbsp;操作 &nbsp; &nbsp; 计数:{{ stores.length }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(store,index) of stores" :key="index" :style="{
              backgroundColor: matchYH(
                store.data.route,
                store.data.datDep,
                store.data.flightNo
              )
                ? '#ffe5e5'
                : '',
            }">
            <td v-text="store.data.route"></td>
            <td v-text="store.data.datDep"></td>
            <td>{{ whichWeek(store.data.datDep) }}</td>
            <td :id="store.data.datDep + store.data.flightNo" @mouseleave="layer.closeAll()" @mouseenter="
                orderAndStoreTipInfo(
                  store.data.datDep,
                  store.data.flightNo,
                  store.data.datDep + store.data.flightNo
                )
              " v-text="store.data.flightNo"></td>
            <td style="color: red; font-weight: bold;">
              {{ "" + store.data.isfullamount == "true" ? "全" : "" }}
            </td>
            <td :class="{ red: store.data.teamStat == '全部收满' }">
              {{
                store.data.teamStat == "全部收满"
                  ? "全满"
                  : store.data.teamStat == "部分收满"
                  ? "部分"
                  : store.data.teamStat
              }}
            </td>
            <td>
              <a target="_blank" :href="
                  '/store/storedetail.htm?datDep=' +
                    store.data.datDep +
                    '&flightNo=' +
                    store.data.flightNo +
                    '&route=' +
                    store.data.route
                " v-text="store.data.storeApply"></a>
            </td>
            <td>
              <a target="_blank" :href="
                  '/order/chksegsissue.htm?datDep=' +
                    store.data.datDep +
                    '&flightNo=' +
                    store.data.flightNo +
                    '&route=' +
                    store.data.route +
                    '&segStat=' +
                    escape('待出票')
                " v-text="store.data.segWait"></a>
            </td>
            <td>
              <a target="_blank" :href="
                  '/order/clientorderlist.htm?datDep=' +
                    store.data.datDep +
                    '&flightNo=' +
                    store.data.flightNo +
                    '&route=' +
                    store.data.route
                " v-text="store.data.segPreSale"></a>
            </td>
            <td>
              <a target="_blank" :href="
                  '/order/chksegsissue.htm?datDep=' +
                    store.data.datDep +
                    '&flightNo=' +
                    store.data.flightNo +
                    '&route=' +
                    store.data.route +
                    '&segStat=' +
                    escape('出票完成')
                " v-text="store.data.storeUsed"></a>
            </td>
            <td v-text="store.data.segIssue"></td>
            <td :class="{
                green: store.data.shengyu < 0,
                red: store.data.shengyu > 0,
              }" v-text="store.data.shengyu"></td>
            <td>
              <a target="_blank" :href="
                  '/order/chksegsissue.htm?datDep=' +
                    store.data.datDep +
                    '&flightNo=' +
                    store.data.flightNo +
                    '&route=' +
                    store.data.route
                " v-text="store.data.segAll"></a>
            </td>
            <td>
              <a v-if="store.lastordertime" v-bind:class="
                  recentSalesRemind(store.data.datDep, store.lastordertime)
                " target="_blank" :href="
                  '/order/ticketprogress.htm?r=' +
                    Math.random() +
                    '&datDep=' +
                    store.data.datDep +
                    '&flightNo=' +
                    store.data.flightNo +
                    '&route=' +
                    store.data.route
                ">
                {{ recentSales(store.lastordertime) }}
              </a>
            </td>
            <td>
              <a target="_blank" :href="
                  '/order/chksegs.htm?datDep=' +
                    store.data.datDep +
                    '&flightNo=' +
                    store.data.flightNo +
                    '&route=' +
                    store.data.route
                ">提票</a>
              <span class="btn1" @click="teamApply(store.data)">申团</span>

              <el-popover placement="top" width="400" trigger="click" @hide="popoverHide">
                <div style="text-align: right; margin: 0">
                  <div style="margin-bottom: 10px;">
                    <el-input type="text" placeholder="请输入备注" v-model="remarks" size="mini"></el-input>
                  </div>
                  <el-button type="primary" size="mini" @click="saveRemarks(store.id)">保存</el-button>
                </div>
                <i class="el-icon-edit-outline" style="margin-left: 5px; cursor: pointer;" slot="reference"></i>
              </el-popover>
              <el-tooltip v-if="store.remarks.length > 0" class="item" effect="dark" placement="top">
                <div slot="content">
                  <p v-for="(item, index) in store.remarks" :key="index">
                    {{ item.ctime }}
                    <span style="text-align: center; display: inline-block; width: 50px;">{{ item.operator }}
                    </span>
                    {{ item.remarks }}
                  </p>
                </div>
                <i class="el-icon-message" style="margin-left: 5px; cursor: pointer;"></i>
              </el-tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
    <div style="clear:both;"></div>

    <div>库存(总申请数) - 已收(未出票) - 预收 - 已出票(库存已使用) = 剩余</div>


  </div>
</template>
<script>
  import {qryobj} from "../../../../../config/dingdan";
  export default {
    data() {
      return {
        configs: "",
        stores: "",
        storesBack: "",
        orders: "",
        // 重写
        flightNo:"",
        qry: {
          pnr: "",
          notDep: true, //未起飞的数据
          onlyStore: qryobj(location.search).flightNo == undefined, //有库存的
          airCo: qryobj(location.search).flightNo ?
            qryobj(location.search).flightNo.substr(0, 2) :
            "UO" || "UO",
          route: qryobj(location.search).route || "",
          datDep: qryobj(location.search).datDep || "",
          flightNo: qryobj(location.search).flightNo || "",
          teamStat: "",
        },
        isAsc: true,

        teamStats: ["", "全部收满", "部分收满"],

        sort1: 1,
        sort0: -1,

        newitem: {
          route: "",
          datDep: "",
          flightNo: "",
          cabin: "",
          qty: 0,
          price: 0,
          rmkApply: "",
        },
        priceInfo: {
          pirce: "",
          tax: "",
          currency: "",
        },
        visible: false,
        remarks: "",
      };
    },
    mounted() {
      // alert(this.qryobj(location.search).flightNo)
      this.flightNo=this.qryobj(location.search).flightNo
      this.axios.post("/order/configs", ["operAuth"]).then((rtn) => {
        this.configs = rtn.configs;
        this.search(this);
      });
    },
    methods: {
      qryobj() {
        var theRequest = new Object();
        if (location.search.indexOf("?") != -1) {
          var str = location.search.substr(1);
          var strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
          }
        }
        return theRequest;
      },
      // 特殊做活动 
      matchYH(route, depdat, flightno) {
        const cons = [{
            route: 'PVG-KUL',
            depdat: '2019-10-20',
            flightno: 'MH389'
          },
          {
            route: 'KUL-PVG',
            depdat: '2019-10-13',
            flightno: 'MH388'
          },
          {
            route: 'KUL-PVG',
            depdat: '2019-10-21',
            flightno: 'MH388'
          },
        ];
        let obj = cons.find(v => {
          return (v.route == route && v.depdat == depdat && v.flightno == flightno);
        });
        if (obj) {
          return true;
        } else {
          return false;
        }
      },
      whichWeek(date) {
        const weeklist = ['日', '一', '二', '三', '四', '五', '六'];
        let week = new Date(date).getDay();
        return weeklist[week];
      },
      popoverHide() {
        this.remarks = '';
      },
      saveRemarks(id) {
        let remarks = this.remarks;
        let params = {
          id: id,
          remarks: remarks
        }
        this.axios.post('/store/storeRemarks', params).then(rtn => {
          document.querySelector("#app").click();
          this.search();
        }).catch(err => {
          alert('保存失败');
        });
      },
      // 间隔 最近销售
      recentSales(lastordertime) {
        return Math.floor((Math.abs((new Date().getTime() - new Date(lastordertime).getTime())) / 1000 / 60 / 60 / 24))
      },
      recentSalesRemind(datDep, lastordertime) {
        let sale = this.recentSales(lastordertime);
        let nowctime = new Date().getTime();
        let datDepctime = new Date(datDep).getTime();
        let datDep30before = datDepctime - 30 * 24 * 60 * 60 * 1000;
        if (nowctime > datDep30before && nowctime < datDepctime) {
          if (sale >= 1 && sale <= 3) {
            return 'numwarning';
          } else if (sale >= 4 && sale <= 7) {
            return 'numdanger';
          } else if (sale >= 8) {
            return 'numverydanger';
          } else {
            return 'numdefault';
          }
        }
      },
      search: function () {
        this.qry.pnr = this.qry.pnr.toUpperCase();
        this.qry.airCo = this.qry.airCo.toUpperCase();
        this.qry.route = this.qry.route.toUpperCase();
        this.qry.flightNo = this.qry.flightNo.toUpperCase();

        this.search(this)
      },
      sortDepGo: function () {
        [this.sort1, this.sort0] = [this.sort0, this.sort1]
        this.stores.sort((x, y) => x.data.datDep > y.data.datDep ? this.sort1 :
          this.sort0)
      },
      sortDepBack: function () {
        [this.sort1, this.sort0] = [this.sort0, this.sort1]
        this.storesBack.sort((x, y) => x.data.datDep > y.data.datDep ? this.sort1 :
          this.sort0)
      },
      sortShengYuGo: function () {
        [this.sort1, this.sort0] = [this.sort0, this.sort1]
        this.stores.sort((x, y) => x.data.shengyu > y.data.shengyu ? this.sort1 :
          this.sort0)
      },
      sortShengYuBack: function () {
        [this.sort1, this.sort0] = [this.sort0, this.sort1]
        this.storesBack.sort((x, y) => x.data.shengyu > y.data.shengyu ? this.sort1 :
          this.sort0)
      },
      teamApply: function (store) {
        this.newitem.route = store.route
        this.newitem.flightNo = store.flightNo
        this.newitem.datDep = store.datDep

        layer.open({
          type: 1,
          title: "临团申请",
          area: ['500px', '490px'],
          content: $('#new'),
          zIndex: 1000,
        });
      },
      applySubmit: function () {
        this.fnapplySubmit(this)
      },
      priceGet: function () {
        if (this.newitem.route && this.newitem.flightNo && this.newitem.cabin) {
          this.newitem.route = this.newitem.route.trim().toUpperCase();
          this.newitem.flightNo = this.newitem.flightNo.trim().toUpperCase();
          this.newitem.cabin = this.newitem.cabin.trim().toUpperCase();
          pl = {
            airCo: this.newitem.flightNo.substr(0, 2),
            route: this.newitem.route,
            cabin: this.newitem.cabin,
          }
          this.axios.post('/order/priceGwGet', pl).then(rtn => {
            if (rtn.data.hasOwnProperty("price")) {
              this.newitem.price = parseInt(rtn.data.price) + parseInt(rtn.data.tax);
              this.priceInfo.price = rtn.data.price;
              this.priceInfo.tax = rtn.data.tax;
              this.priceInfo.currency = rtn.data.currency;
            }
          })
        }
      },
      ep: function () {
        $("#form2").submit();
      },





      search(app) {
        // layer.load(2)
        this.axios.post("/store/storeQry", app.qry).then((rtn) => {
          // layer.closeAll()

          rtn.map(function (x) {
            x.data.storeApply = x.data.storeApply || 0;
            let t =
              x.data.storeApply -
              x.data.segWait -
              x.data.segPreSale -
              x.data.storeUsed; // x.data.segIssued
            x.data.shengyu = t || 0;
          });
          app.stores = rtn;
        });

        if (
          app.qry.pnr === "" &&
          app.qry.flightNo === "" &&
          app.qry.route !== ""
        ) {
          layer.load(2);
          let t = app.qry.route.split("-");
          let qry = JSON.parse(JSON.stringify(app.qry));
          qry.route = t[1] + "-" + t[0];
          this.axios.post("/store/storeQry", qry).then((rtn) => {
            layer.closeAll();

            rtn.data.map(function (x) {
              x.data.storeApply = x.data.storeApply || 0;
              let t =
                x.data.storeApply -
                x.data.segWait -
                x.data.segPreSale -
                x.data.storeUsed;
              x.data.shengyu = t || 0;
            });
            app.storesBack = rtn.data;
          });
        }
      },
      fnapplySubmit(app) {
            app.newitem.route = app.newitem.route.trim().toUpperCase();
            if (app.newitem.route == "") {
                layer.msg('请输入行程!')
                return;
            }

            app.newitem.datDep = app.newitem.datDep.trim();
            if (app.newitem.datDep == "") {
                layer.msg('请输入起飞开始日期!');
                return;
            }

            app.newitem.flightNo = app.newitem.flightNo.trim().toUpperCase();
            if (app.newitem.flightNo == "") {
                layer.msg('请输入航班号!');
                return;
            }

            app.newitem.cabin = app.newitem.cabin.trim().toUpperCase();
            if (app.newitem.cabin == "") {
                layer.msg('请输入舱位!');
                return;
            }

            app.newitem.qty = app.newitem.qty.trim();
            if (app.newitem.qty == "") {
                layer.msg('请输入人数!');
                return;
            }
            app.newitem.price = app.newitem.price.trim();
            if (app.newitem.price == "") {
                layer.msg('请输入单价!');
                return;
            }

            let data = {
                "cabin": app.newitem.cabin,
                "cntPay": 0,
                "company": "",
                "datDep": app.newitem.datDep,
                "deposit": 0,
                "depositAcct": "",
                "depositDat": "",
                "email": "",
                "flightNo": app.newitem.flightNo,
                "flightNoOrg": app.newitem.flightNo,
                "isValid": 1,
                "issueTaskId": 0,
                "oper": window.localStorage['uid'],
                "pay2": 0,
                "pnr": "",
                "price": parseFloat(app.newitem.price),
                "qty": parseFloat(app.newitem.qty),
                "rmkApply": app.newitem.rmkApply,
                "rmkAudit": "",
                "route": app.newitem.route,
                "segIds": [],
                "serial": "",
                "stat": "待审核",
                "statPay": "",
                "sum": app.newitem.qty * app.newitem.price,
                "timeApply": new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "timeAudit": "",
                "auditOper": "",
                "type": "临团",
                "qCardInfo": {}
            }
            this.axios.post('/store/additemapply', data).then(rtn => {
                if (rtn.data.code == 1) {
                    // app.newitem.id = rtn.data.id;
                    // app.newitem.data = data;
                    // app.applys.push(app.newitem);
                    layer.closeAll()
                    layer.msg('保存成功!', {
                            icon: 1
                        })
                        // layer.alert('保存成功!', {
                        //     icon: 6,
                        //     yes: function () {
                        //         layer.closeAll();
                        //     }
                        // });
                } else {
                    layer.alert('保存失败!', {
                        icon: 5
                    });
                }
            })
        }
    },
  };
</script>