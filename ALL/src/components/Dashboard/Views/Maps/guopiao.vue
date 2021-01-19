<template>
  <div>
    <div class="row">
      <form @submit.prevent="submit">
        <div class="form-group col-md-2">
          <a-form-item>
            <label class="form-label">航段</label>
            <input type="text" class="form-control" v-model="qry.route" placeholder="航段，支持航段" />
          </a-form-item>
        </div>
        <div class="form-group col-md-2">
          <a-form-item>
            <label class="form-label">起飞日期</label>
            <el-date-picker type="date" value-format="yyy-MM-dd" v-model="qry.datDep" placeholder="起飞日期">
            </el-date-picker>
          </a-form-item>
        </div>
        <div class="form-group col-md-2">
          <a-form-item>
            <label class="form-label">航班号</label>
            <input type="text" v-model="qry.flightNo" class="form-control" />
          </a-form-item>
        </div>
        <div class="form-group col-md-2">
          <a-form-item>
            <label class="form-label">航司</label>
            <input type="text" v-model="qry.airCo" class="form-control" placeholder="航司" />
          </a-form-item>
        </div>
        <button class="btn btn-info btn-fill">查询</button>
      </form>
      <!-- 页面初始化时加载的表格 -->
      <div v-if="showTop">
        <ul>
          <li v-for="air of airCos" :key="air">
            <h3>
              {{ air
              }}<span style="font-size:18px">
                ({{
                  topData
                    .filter((x) => x.airco === air)
                    .reduce((tot, cur) => tot + parseInt(cur.segwait), 0)
                }})</span>
            </h3>
            <!-- 表格渲染 错误 -->
            <el-table :data="topData">
              <el-table-column label="航段">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="input(scope.route, air)"></el-button>
                </template>
              </el-table-column>
              <el-table-column prop="segwait" label="未出"></el-table-column>
            </el-table>
          </li>
        </ul>
      </div>
    </div>
    <!-- 点击查询出来后的页面 -->
    <!-- <div v-if="segs.length"> -->
    <div class="row">
      <div class="form-group col-md-2">
        <a-form-item>
          <label class="form-label">过票状态</label>
          <el-select>
            <el-option value="1" label="未出"></el-option>
          </el-select>
        </a-form-item>
      </div>
      <div class="col-md-2">
        <!-- <a-form-item> -->
        <p-checkbox>排除当天已过票</p-checkbox>
        <!-- </a-form-item> -->
      </div>
      <!-- <p-radio-group>
        <p-radio :label="1">全部</p-radio>
      <p-radio :label="2">仅显示无库存</p-radio>
      <p-radio :label="3">仅显示有库存</p-radio>

      </p-radio-group> -->
      <div class="col-md-1">
        <p-radio>全部</p-radio>
      </div>
      <div class="col-md-2">
        <p-radio>仅显示无库存</p-radio>
      </div>
      <div class="col-md-2">
        <p-radio>仅显示有库存</p-radio>
      </div>
      <el-table>
        <el-table-column v-for="column in tableColumns" :prop="column.prop" :label="column.label" :key="column.label">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        qry: {
          // 支持的航段数
          route: "",
          // 起飞日期
          datDep: "",
          // 航司
          airCo: "",
          // 航班号
          flightNo: "",
        },
        // 页面开始时，航司和未出是显示出来的
        showTop: true,
        // 所有的航司
        airCos: "",
        // 页面航段数量
        topDate: "",
        // 点击航段跳转的页面，下拉选择框中的触发事件的元素
        chkStatSelected: "",
        // 过票状态
        tktCheckStatus: "",
        // 排除当前已过票
        isNotChecked: false,
        // 显示库存按钮,加载页面后默认选中是显示全部
        filterShengyu: "0",
        // 表格渲染数据
        tableColumns: [{
            prop: "idx",
            label: "ID",
          },
          {
            prop: "data.route",
            label: "航段",
          },
          // 可点击 XXX
          {
            prop: "data.datDep",
            label: "起飞日期",
          },
          {
            prop: "data.flightNo",
            label: "航班号",
          },
          {
            prop: "data.segAll",
            label: "总收",
          },
          {
            prop: "data.segWait",
            label: "未出",
          },
          // 可点击
          {
            prop: "shengyu",
            label: "库存",
          },
          {
            prop: "cabinw  seatw",
            label: "外放",
          },
          {
            prop: "apicabinw apiseatw",
            label: "ＡＰＩ外放",
          },
          {
            prop: "cabinload",
            label: "上座率",
          },
          // 重写
          {
            prop: "item.tktcheck?item.tktcheck.cabintmp:",

            label: "临团",
          },
          {
            prop: "availableSeat",
            label: "余位",
          },
          // 重写
          {
            prop: "",
            label: "舱位小计",
          },
          {
            prop: "",
            label: "过票记录",
          },
          {
            prop: "",
            label: "降舱",
          },
          {
            prop: "",
            label: "降舱时间",
          },
          {
            prop: "",
            label: "占位最近时间",
          },
          {
            prop: "",
            label: "操作",
          },
        ],
        gp: {
          stat: "",
          rmk: "",
          route: "",
          datDep: "",
          remain: "",
          cabintmp: "",
          flightNo: "",
          flightNoOrg: "",
          last: "",
        },
        priceInfo: "",

        showTop: true,
        topData: "",
        airCos: "",
        segs: "",
        segsFilted: "",
        tktCheckStatus: "",
        chkStatSelected: "",
        isNotChecked: false,
        filterShengyu: "0",

        sort1: 1,
        sort2: -1,
      };
    },
    mounted: {
      function () {
        topAll(this);
      },
    },
    method: {
      // 用于提交form表单
      submit: function () {
        // search是查询的意思
        search(this);
      },
      // 搜索到的航班数和航段
      input: function (route, airCo) {
        // 搜索航段
        this.qry.route = route;
        // 搜索航司
        this.qry.airCo = airCo;
        search(this);
      },

      // 触发航段跳转页面时，需要过滤的条件
      chkStatFilter: function () {
        // 从数据中获取的每个航段的数据
        this.segsFilted = this.segs;
        // 当过票状态不为空时
        if (this.chkStatSelected != "") {
          this.segsFilted = this.segsFilted.filter(
            (x) => x.tktcheck.stat == this.chkStatSelected
          );
        }
        // 当排除当前过票被选中时触发的事件
        if (this.isNotChecked) {
          this.segsFilted = this.segsFilted.filter(
            (x) => x.tktcheck.dat < new new Date().Format("yyyy-MM-dd")
          );
          console.log(11, new Date().Format("yyyy-MM-dd"));
        }
        // 仅显示有库存的单选按钮
        if (this.filterShengyu == "1") {
          this.segsFilted = this.segsFilted.filter((x) => x.shengyu >= 0);
        }
        // 仅显示无库存的单选按钮
        if (this.filterShengyu == "-1") {
          this.segsFilted = this.segsFilted.filter((x) => x.shengyu < 0);
        }
      },
      // 触发航段中表格事件的加载
      sortBy: function (col) {
        [this.sort1, this.sort2] = [this.sort2, this.sort1];
        this.segsFilted.sort((x, y) =>
          x[col] > y[col] ? this.sort1 : this.sort2
        );
      },
      //上座率
      loadTrendGet: function (flightNo, datDep) {
        loadTrendGet({
            flightNo: flightNo,
            datDep: datDep,
          },
          this
        );
      },

      tktCheck: function (route, datDep, flightNo, lastCheck, event) {
        // $('#'+event.target.id).parent().parent().addClass('tktcheckbg');
        this.gp.route = route;
        this.gp.datDep = datDep;
        this.gp.flightNo = flightNo;
        this.gp.flightNoOrg = flightNo;

        this.gp.stat = lastCheck.stat;
        this.gp.rmk = lastCheck.rmk;
        this.gp.cabintmp = lastCheck.cabintmp;
        this.gp.remain = lastCheck.remain;

        layer.open({
          type: 1,
          title: "添加过票记录",
          area: ["400px", "300px"],
          content: $("#tktCheckDiv"),
        });
      },

      tips: function (info, id) {
        layer.tips(info, "#" + id, {
          tips: [2, "#777777"],
          area: ["400px"],
          time: 10 * 1000,
        });
      },

      tipShow: function (datDep, flightNo, cnt, id) {
        // console.log(datDep,flightNo);
        segsChkGet(datDep, flightNo, cnt, id, this);
      },

      tktCheckSubmit: function () {
        tktCheckSubmit(this);
      },
      tktIssue: function (route, datDep, flightNo) {
        window.open(
          "/order/chksegs.htm?datDep={0}&flightNo={1}&route={2}".format(
            datDep,
            flightNo,
            route
          )
        );
      },
      chkStatFilter: function () {
        this.segsFilted = this.segs;

        if (this.chkStatSelected != "") {
          this.segsFilted = this.segsFilted.filter(
            (x) => x.tktcheck.stat == this.chkStatSelected
          );
        }

        if (this.isNotChecked) {
          this.segsFilted = this.segsFilted.filter(
            (x) => x.tktcheck.dat < new Date().Format("yyyy-MM-dd")
          );
          console.log(11, new Date().Format("yyyy-MM-dd"));
        }

        if (this.filterShengyu == "1") {
          this.segsFilted = this.segsFilted.filter((x) => x.shengyu >= 0);
        }

        if (this.filterShengyu == "-1") {
          this.segsFilted = this.segsFilted.filter((x) => x.shengyu < 0);
        }
      },
      sortBy: function (col) {
        [this.sort1, this.sort2] = [this.sort2, this.sort1];
        this.segsFilted.sort((x, y) =>
          x[col] > y[col] ? this.sort1 : this.sort2
        );
      },
      linkToStore: function (route, datDep, flightNo) {
        window.open(
          "/store/storesummary.htm?datDep={0}&flightNo={1}&route={2}".format(
            datDep,
            flightNo,
            route
          )
        );
      },
      storeApplyShow: function (route, datDep, flightNo) {
        layer.open({
          type: 2,
          title: "临团申请",
          content: "/parts/storeapply.htm?route=" +
            route +
            "&datDep=" +
            datDep +
            "&flightNo=" +
            flightNo +
            "&r=" +
            Math.random(),
          zIndex: 1000,
          area: ["500px", "490px"],
        });
      },
      // 封装的方法
      loadTrendGet(qry, app) {
        axios.post("/api/order/loadTrendGet", qry).then((rtn) => {
          if (rtn.data.length > 0) {
            let mychart = echarts.init(document.getElementById("loadTrend"));
            option = {
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985",
                  },
                },
              },
              xAxis: {
                type: "category",
                data: rtn.data[0].logs.map((x) => x.dat),
              },
              yAxis: {
                type: "value",
                interval: 5,
              },
              series: [{
                data: rtn.data[0].logs.map((x) => x.load),
                type: "line",
              }, ],
            };
            mychart.setOption(option);
            layer.open({
              type: 1,
              shadeClose: true,
              title: "上座率趋势",
              area: ["1010px"],
              content: $("#loadTrend"),
            });
          }
        });
      },
      tktCheckSubmit(app) {
        axios.post("/api/order/tktChkSave", app.gp).then((rtn) => {
          if (rtn.data.id > 0) {
            layer.close(layer.index);
            let o = app.segs.filter(
              (x) =>
              x.data.flightNo === app.gp.flightNo &&
              x.data.datDep === app.gp.datDep
            );
            if (o.length) {
              o[0].tktcheck.stat = app.gp.stat;
              o[0].tktcheck.rmk = app.gp.rmk;
              o[0].tktcheck.oper = "Me";
              o[0].tktcheck.dat = new Date().yyyyMMdd();
            }
          } else {
            alert("保存过票记录失败！");
          }
        });
      },
      search(app) {
        app.showTop = false;
        //
        layer.load(2);
        axios.post("/api/order/segCntQry", app.qry).then((rtn) => {
          console.log(rtn);
          layer.closeAll();

          if (rtn.data.orders.rowCount == 0) {
            return;
          }

          rtn.data.orders.sort(by("datDep", "data", 1, by("route", "data", 1)));

          rtn.data.orders.forEach((x, index) => {
            x.idx = index + 1;
            x.datDep = x.data.datDep;

            if (x.cabinload) {
              x.cabinload = x.cabinload + "%";
              x.cabinloadNum = parseFloat(x.cabinload);
            } else {
              x.cabinloadNum = 0;
            }
            // x.data.storeRemain = x.data.storeRemain || 0
            x.shengyu =
              x.data.storeApply -
              x.data.segWait -
              x.data.segPreSale -
              x.data.storeUsed || 0;

            // x.data.cabintmp = "";

            if (x.tktcheck) {
              x.tktcheck.remainNum = parseFloat(x.tktcheck.remain);
              x.remainNum = x.tktcheck.remainNum;
            }
            if (!x.tktcheck.dat) {
              x.tktcheck = {
                stat: "",
                rmk: "",
                oper: "",
                dat: "",
                remainNum: 0,
              };
            }
          });

          app.segs = rtn.data.orders;
          app.segsFilted = app.segs;
          app.tktCheckStatus = rtn.data.checkStatus;
          app.gp.stat = app.tktCheckStatus[0];
        });
      },
      topAll(app) {
        axios.get("/api/order/tktWaitAll").then((rtn) => {
          app.topData = rtn.data;
          app.airCos = Array.from(new Set(app.topData.map((x) => x.airco)));
        });
      },
      segsChkGet(datDep, flightNo, cnt, id, app) {
        axios
          .post("/api/order/segChksGet", {
            datDep: datDep,
            flightNo: flightNo,
            cnt: cnt,
          })
          .then((rtn) => {
            // console.log(rtn.data);
            // app.chks = rtn.data
            // $("#tipdiv").html()
            if (rtn.data.length > 10) {
              layer.open({
                type: 1,
                shadeClose: true,
                area: ["1000px", "600px"],
                title: "过票记录",
                content: tipTableGen(rtn.data),
              });
            } else if (rtn.data.length > 0) {
              layer.tips(tipTableGen(rtn.data), "#" + id, {
                tips: 3,
                area: ["770px"],
                time: 60 * 1000,
              });
            }
          });
      },
      tipTableGen(datas) {
        let r =
          '<table class="chkTbl"><tr><td>状态</td><td>临团舱</td><td>余位</td><td>时间</td><td>操作员</td><td>过票说明</td></tr>';
        for (let item of datas) {
          r +=
            "<tr><td>" +
            item.stat +
            "</td><td>" +
            item.cabintmp +
            "</td><td>" +
            item.remain +
            "</td><td>" +
            item.dat +
            "</td><td>" +
            item.oper +
            "</td><td>" +
            item.rmk +
            "</td></tr>";
        }
        r += "</table>";
        return r;
      }
    },
  };
</script>