<template>
  <div>
    <div>
      <el-form :model="qry">
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>订单号</label>
            <input type="text" placeholder="支持多订单号" v-model="qry.orderNo" class="form-control" />
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>姓名</label>
            <input type="text" class="form-control" v-model="qry.pName" />
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>航段</label>
            <input type="text" class="form-control" v-model="qry.route" />
          </el-form-item>
        </div>
        <div class="col-md-2  form-group">
          <el-form-item>
            <label>航班号</label>
            <input type="text" class="form-control" v-model="qry.flightNo" />
          </el-form-item>
        </div>
        <div class="col-md-2  form-group">
          <el-form-item>
            <label>航司</label>
            <input type="text" class="form-control" v-model="qry.airCo" />
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>票号</label>
            <input type="text" class="form-control" v-model="qry.tktNo" />
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>出票PNR</label>
            <input type="text" class="form-control" v-model="qry.tktIssuePnr" />
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>类型</label>
            <el-select v-model="qry.tripType">
              <el-option v-for="type of tripType" :key="type" :label="type"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>来源</label>
            <el-select v-model="qry.src">
              <el-option v-for="channel of configs.orderChannel" :key="channel" :label="channel"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>状态</label>
            <el-select v-model="qry.segStat">
              <el-option v-for="stat of segStat" :key="stat" :label="stat"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>验真</label>
            <el-select v-model="qry.check">
              <el-option v-for="chk of check" :key="chk" :label="chk">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>出票员</label>
            <el-select v-model="qry.tktIssueOper">
              <el-option v-for="chk of configs.opers" :key="chk" :label="chk"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>起飞日期</label>
            <el-date-picker value-format="yyyy-MM-dd" v-model="qry.datDep" type="date" size="mini" placeholder="起飞日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>订单日期</label>
            <el-date-picker value-format="yyyy-MM-dd" type="date" size="mini" v-model="qry.datCreate"
              placeholder="订单日期"></el-date-picker>
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>出票日期</label>
            <el-date-picker value-format="yyyy-MM-dd" type="date" size="mini" v-model="qry.tktIssueDat"
              placeholder="出票日期"></el-date-picker>
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label>流水号</label>
            <input type="text" class="form-control" v-model="qry.rcvSerial" />
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <label></label>
            <el-checkbox v-model="qry.urge">催(仅排序)</el-checkbox>
          </el-form-item>
        </div>
        <div class="col-md-2 form-group">
          <el-form-item>
            <button class="btn btn-info btn-fill" @click.prevent="search">
              查询
            </button>
            <button :disabled="canExport == false" class="btn btn-info btn-fill">
              导出
            </button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div>
      <el-table :data="segDetails" border>
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="渠道/订单号" width="200" >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="orderInfo(data.orderNo)">
              
            </el-button>
            {{ scope.row.data.src
            }}<span style="color: red;">{{
              scope.row.data.ticketSite == "E" ? "IBU" : ""
            }}</span>
            <!-- <a :href="'/order/orderInfo.htm?orderNo='+item.data.orderNo + '&r='+Math.random()" target="_blank"> -->
            <router-link :to="{path:`/maps/tankuang/orderInfo?`+'orderNo='+scope.row.data.orderNo}">
            {{ scope.row.data.orderNo }}
            </router-link>
            <!-- </a> -->
          </template>
        </el-table-column>
        <el-table-column label="类型" width="70">
          <template slot-scope="scope">
            {{ scope.row.data.tripType
            }}<span v-if="scope.row.data.isGaiQi == 1" style="color:red;">[改]</span>
          </template>
        </el-table-column>
        <el-table-column v-for="column of tableColumns" :label="column.label" :prop="column.prop" :width="column.width"
          :key="column"></el-table-column>
        <el-table-column label="航段/航班号" width="150">
          <template slot-scope="scope">
            <span class="colorBlue" @click="
                linkToStore(
                  scope.row.data.route,
                  scope.row.data.datDep,
                  scope.row.data.flightNo
                )
              ">{{ scope.row.data.route }}</span>
            <span :class="{
                fc:
                  scope.row.data.flightNo != scope.row.data.flightNoOrg &&
                  scope.row.data.flightNoOrg != '',
              }" class="colorBlue" :id="'r' + scope.id" @mouseleave="layer.closeAll()" @mouseenter="
                orderAndStoreTipInfo(
                  scope.row.data.datDep,
                  scope.row.data.flightNo,
                  'r' + scope.id
                )
              ">{{ scope.row.data.flightNo }}</span>
          </template>
        </el-table-column>
        <el-tabel-column label="起飞日期">
          <template slot-scope="scope">
            {{scope.row.data.time.substr(0,16)}}
          </template>
        </el-tabel-column>
        <el-table-column label="舱位">
          <template slot-scope="scope">
            {{scope.row.data.cabin}}<span style="color:red;"
              v-if="scope.row.data.cabinIssue">({{scope.row.data.cabinIssue}})</span>
          </template>
        </el-table-column>
        <el-table-column label="收款">
          <template slot-scope="scope">
            {{scope.row.data.price + scope.row.data.tax}}
          </template>
        </el-table-column>
        <el-table-column label="票号">
          <template slot-scope="scope">
            {{scope.row.data.tktIssuePnr}}<br>{{scope.row.data.tktNo}}
          </template>
        </el-table-column>
        <el-table-column label="出票时间">
          <template slot-scope="scope">
            <span v-if="scope.row.data.tktIssueTime">{{scope.row.data.tktIssueTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="辅营">
          <template slot-scope="scope">
            {{scope.row.data.bag + '/'+ scope.row.data.meal + '/'+ scope.row.data.seat}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {
    DatePicker,
    TimeSelect,
    Slider,
    Tag,
    Input,
    Button,
    Select,
    Option,
  } from "element-ui";
  import PProgress from "src/components/UIComponents/Progress.vue";
  import PSwitch from "src/components/UIComponents/Switch.vue";
  export default {
    components: {
      [DatePicker.name]: DatePicker,
      [TimeSelect.name]: TimeSelect,
      [Slider.name]: Slider,
      [Tag.name]: Tag,
      [Input.name]: Input,
      [Button.name]: Button,
      [Option.name]: Option,
      [Select.name]: Select,
      PSwitch,
      PProgress,
    },
    data() {
      return {
        configs: "",
        canExport: true,
        segs: "",
        segsFiltered: "",
        segDetails: [],
        // storeSums: "",
        storeDetails: null, //库存详情
        market: "", //外放数据
        load: "", //上座率
        loadTrendData: "",
        // qry: location.search.qryobj(),
        isCheckAll: false,
        tktCheckStatus: "", //过票状态
        chks: "", //过票记录
        // isTktIssue: false,//显示过票操作区域

        //过滤航段/人
        // channels: null,
        channelFilter: "ALL",
        orderNoFilter: "",
        pNameFilter: "",

        tktCheckStat: "s",
        tktCheckRmk: "",
        tktCheckRemain: 1,
        tktCheckRoute: "",
        tktCheckdatDep: "",
        tktCheckflightNo: "",
        tktCheckTeamTmpCabin: "A",

        tktIssueChannel: null,
        tktIssueMail: null,
        tktIssueCabins: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
        ],
        tktIssueCabin: "A",
        tktIssueCabinRet: "",
        tktIssueRmk: "",
        tktIssuePnr: "",

        cntSelected: 0,
        cntFake: 0,
        cntWaste: 0,
        cntFree: 0,

        storeSelectedId: 0,
        storeSelectedType: null,
        storeSelectedCnt: 0,
        storeSelectedPnr: "",
        storeSelectedSum: 0,

        filterStat: "",
        filterCabinGw: "",
        filterFlightNo: "",

        segStat: ["待出票", "出票中", "出票完成", "已取消", "已作废", "退票完成"],
        check: ["待验真", "验真失败", "验真成功_自动", "验真成功_人工"],
        tktIssueOpers: "",
        tripType: ["单程", "往返", "缺口"],
        total: 0,
        qry: {
          orderNo: "",
          // flightNo: location.search.qryobj().flightNo || "",
          flightNo: "",
          // route: location.search.qryobj().route || "",
          route: "",
          // datDep: location.search.qryobj().datDep || "",
          datDep: "",

          airCo: "",
          pName: "",
          // datCreate: location.search.qryobj().datCreate || "",
          datCreate: "",

          tktIssueDat: "",
          tktNo: "",
          src: "",
          // segStat: location.search.qryobj().segStat || "",
          segStat: "",

          check: "",
          tktIssueOper: "",
          tktIssuePnr: "",
          tripType: "",
          rcvSerial: "",
          urge: false,
          page: {
            idx: 1,
            cnt: 10,
          },
        },

        profitInfo: {
          rcv: 0,
          pay: 0,
          profit: 0,
          priceInfo: "",
        },
        tktIssueChannels: [],
        //出往返
        showRetIssueCabin: false,
        // 渲染表格
        tableColumns: [{
            prop: "data.segStat",
            label: "状态",
          },
          {
            prop: "urgetimes",
            label: "催",
            width: 70
          },
          {
            prop: "data.timeCreate",
            label: "订单时间",
            width: 170
          },
          {
            prop: "data.route",
            label: "航段/航班号",
          },
          {
            prop: "data.tktWaste",
            label: "占位",
          },
          {
            prop: "data.pName",
            label: "姓名",
            width: 160
          },
          {
            prop: "data.tktIssueOper",
            label: "出票人"
          },
          {
            prop: "data.check",
            label: "验真"
          }
        ],
      };
    },
    mounted() {

      // function() {
      if (window.localStorage.pageSize) {
        this.qry.page.cnt = parseInt(window.localStorage.pageSize);
      }
      this.axios
        .post("/order/configs", [
          "opers",
          "tktIssueMail",
          "orderChannel",
          "tktIssueChannelDe",
          "airCosAllCHD",
          "autoTkt",
          "operAuth",
          "calProfit",
        ])
        .then((rtn) => {
          // alert(rtn.configs)
          this.configs = rtn.configs;
          this.configs.opers = rtn.configs.opers
        });

      query(this);
      // },
    },
    methods: {
      // 低级表格中的订单号跳转到详情页
      orderInfo(){
        this.$router.push({
          path:`/maps/tankuang/orderInfo`,
          query:{id}
        })
      },
      pageIdxChng: function (val) {
        this.qry.page.idx = val;
        query(this);
      },
      pageSizeChng: function (val) {
        this.qry.page.cnt = val;
        window.localStorage.pageSize = val;
        query(this);
      },
      search() {
        this.qry.page.idx = 1;
        this.axios.post("/order/segDetailQryAll", this.qry).then((res) => {
          // alert(res.segDetails[0].id)
          this.segDetails = res.segDetails;
        });
      },
      tktCheck: function (route, datDep, flightNo) {
        this.tktCheckRoute = route;
        this.tktCheckdatDep = datDep;
        this.tktCheckflightNo = flightNo;
        //这是鼠标在航段/航班号发生的触发事件
        layer.open({
          type: 1,
          title: "添加过票记录",
          area: ["400px", "300px"],
          content: $("#tktCheckDiv"),
        });
      },
      tktCheckSubmit: function () {
        tktCheckSave(
          this.tktCheckStat,
          this.tktCheckRoute,
          this.tktCheckflightNo,
          this.tktCheckdatDep,
          this.tktCheckRemain,
          this.tktCheckRmk,
          this.tktCheckTeamTmpCabin,
          this
        );
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
      loadTrendGet: function (flightNo, datDep) {
        loadTrendGet({
            flightNo: flightNo,
            datDep: datDep,
          },
          this
        );
      },
      selectAll: function () {
        this.isCheckAll = !this.isCheckAll;
        this.segDetails
          .filter((x) => x.data.segStat == "待出票")
          .map((x) => (x.isCheck = this.isCheckAll));
        this.cntSelected = this.segDetails.filter(
          (x) => x.isCheck == true
        ).length;
      },
      checkOne: function (id) {
        this.cntSelected = this.segDetails.filter(
          (x) => x.isCheck == true
        ).length;
      },
      issueSankeApply: function () {
        let segsChecked = this.segDetails.filter((x) => x.isCheck == true);
        let airCo = segsChecked[0].data.airCo;
        let route = segsChecked[0].data.route;
        let flightNo = segsChecked[0].data.flightNo;
        let tmp = route.split("-");
        let route1 = tmp[1] + "-" + tmp[0];
        this.tktIssueChannels = tktChannelsGet(
          this.configs.tktIssueChannelDe,
          route,
          route1,
          airCo
        );
        if (
          isNeedCalProfit(airCo, route, flightNo) &&
          segsChecked[0].data.tripType == "单程"
        ) {
          caclProfit(this.tktIssueCabin);
        }
        if (
          segsChecked[0].data.tripType == "往返" ||
          segsChecked[0].data.tripType == "缺口"
        ) {
          let timeDeps = Array.from(
            new Set(segsChecked.map((x) => x.data.timeDep))
          );
          if (timeDeps.length == 1) {
            //往返只出单段
            this.tktIssueCabinRet = "";
            this.showRetIssueCabin = false;
          } else {
            this.tktIssueCabinRet = "A";
            this.showRetIssueCabin = true;
          }
        } else {
          this.tktIssueCabinRet = "";
          this.showRetIssueCabin = false;
        }

        if (
          window.localStorage["tktIssueChannel"] &&
          this.tktIssueChannels.includes(window.localStorage["tktIssueChannel"])
        ) {
          this.tktIssueChannel = window.localStorage["tktIssueChannel"];
        }
        if (window.localStorage["tktIssueCabin"]) {
          this.tktIssueCabin = window.localStorage["tktIssueCabin"];
        }
        if (window.localStorage["tktIssueCabinRet"]) {
          this.tktIssueCabinRet = window.localStorage["tktIssueCabinRet"];
        }
        if (
          window.localStorage["tktIssueMail"] &&
          this.configs.tktIssueMail.includes(window.localStorage["tktIssueMail"])
        ) {
          this.tktIssueMail = window.localStorage["tktIssueMail"];
        }

        layer.open({
          type: 1,
          title: "提交散客出票",
          area: ["390px", "520px"],
          content: $("#sanke"),
        });
      },
      issueSanke(first) {
        console.log(this.tktIssueChannel);
        if (this.tktIssueChannel == null) {
          msgError("出票渠道不能为空!", 2000);
          return;
        }

        let segsChecked = this.segDetails.filter((x) => x.isCheck == true);
        let segsCheckedCHD = this.segDetails.filter(
          (x) => x.isCheck == true && x.data.ageType == "儿童"
        );
        //判断是否提交了不同起飞日期的订单
        let _tripType = segsChecked[0].data.tripType;
        let timeDeps = Array.from(
          new Set(segsChecked.map((x) => x.data.timeDep))
        );

        if (_tripType == "往返" && timeDeps.length > 2) {
          layer.alert("包含不同起飞日期的往返订单订单", {
            icon: 5
          });
          return;
        }
        if (
          segsChecked.length == segsCheckedCHD.length &&
          this.configs.airCosAllCHD.includes(segsChecked[0].data.airCo)
        ) {
          msgError(segsChecked[0].data.airCo + "不允许提交全部都是儿童的出票单!");
          return;
        }

        segsChecked.sort((x, y) => (x.data.timeDep > y.data.timeDep ? 1 : -1));
        let ids = [];
        let reIds = [];
        if (_tripType == "单程") {
          ids = segsChecked.map((x) => x.id);
        } else {
          if (timeDeps.length == 1) {
            ids = segsChecked.map((x) => x.id);
          } else {
            let fromDeptime = segsChecked[0].data.timeDep;
            ids = segsChecked
              .filter((x) => x.data.timeDep == fromDeptime)
              .map((x) => x.id);
            reIds = segsChecked
              .filter((x) => x.data.timeDep != fromDeptime)
              .map((x) => x.id);
          }
        }
        let orderNos = Array.from(
          new Set(segsChecked.map((x) => x.data.orderNo))
        );
        let pNames = segsChecked.map((x) => x.data.pName);
        let route = Array.from(
          new Set(segsChecked.map((x) => x.data.route))
        ).join();
        let datDep = Array.from(
          new Set(segsChecked.map((x) => x.data.datDep))
        ).join();
        let flightNo = Array.from(
          new Set(segsChecked.map((x) => x.data.flightNo))
        ).join();

        let ordersTime = [];
        segsChecked.forEach((x) => {
          let c = ordersTime.filter((o) => o.orderNo == x.data.orderNo);
          if (c.length == 0) {
            ordersTime.push({
              src: x.data.src,
              orderNo: x.data.orderNo,
              timeDep: x.data.timeDep.substr(0, 16),
              timeCreate: x.data.timeCreate,
            });
          }
        });

        let sumJp = segsChecked.reduce((t, c) => t + c.data.price, 0);
        let sumTax = segsChecked.reduce(
          (t, c) => t + c.data.tax + c.data.oilFee,
          0
        );
        let sumBag = segsChecked.reduce((t, c) => t + c.data.bagPrice, 0);
        let sumAll = sumJp + sumTax + sumBag;

        if (ids.length > 0) {
          this.axios
            .post("/order/tktIssueApply", {
              type: "sanke",
              pay: 0,
              route: route,
              datDep: datDep,
              flightNo: flightNo,
              segIds: ids,
              retSegIds: reIds,
              isUrgent: first,
              orderNos: orderNos,
              pNames: pNames,
              ordersTime: ordersTime,
              tktIssuePnr: "",
              tktIssueCabin: this.tktIssueCabin,
              tktIssueCabinRet: this.tktIssueCabinRet,
              tktIssueApplyRmk: this.tktIssueRmk,
              tktIssueChannel: this.tktIssueChannel,
              tktIssueMail: this.tktIssueMail,
              storeId: 0,
              cntFake: 0,
              cntWaste: 0,
              cntFree: 0,
              typeStore: "",
              sumJp: sumJp,
              sumTax: sumTax,
              sumBag: sumBag,
              sumAll: sumAll,
              segCnt: ids.length,
              tripType: _tripType,
            })
            .then((rtn) => {
              window.localStorage["tktIssueChannel"] = this.tktIssueChannel;
              window.localStorage["tktIssueCabin"] = this.tktIssueCabin;
              window.localStorage["tktIssueCabinRet"] = this.tktIssueCabinRet;
              window.localStorage["tktIssueMail"] = this.tktIssueMail;

              if (rtn.data.code == 0) {
                this.segDetails = this.segDetails.filter(
                  (x) => x.isCheck == false
                );
                layer.close(layer.index);
                layer.msg("搞定", {
                  icon: 1,
                  time: 500,
                });
              } else {
                alert(rtn.data.msg);
              }
            });
        } else {
          alert("请勾选航段！");
        }
      },
      issueTuanApply: function () {
        //点击提交团队出票
        this.cntFake = 0;
        this.cntWaste = 0;
        this.cntFree = 0;
        this.storeSelectedId = 0;

        layer.open({
          type: 1,
          title: "提交团队出票",
          area: ["1000px", "400px"],
          content: $("#tuan"),
        });
      },

      storeSelect: function (id, type, qty, pnr, sum) {
        //选择不同的库存
        console.log(id, type, qty);

        this.storeSelectedId = id;
        this.storeSelectedType = type;
        this.storeSelectedCnt = parseInt(qty);
        this.storeSelectedPnr = pnr;
        this.storeSelectedSum = sum;

        if (type === "临团") {
          this.cntFake = qty - this.cntSelected;
          this.cntWaste = 0;
          this.cntFree = 0;
        } else {
          this.cntFake = 0;
          this.cntWaste = qty - this.cntSelected;
          this.cntFree = 0;
        }
      },
      teamCntChngWaste: function () {
        this.cntFree =
          this.storeSelectedCnt - this.cntSelected - parseInt(this.cntWaste);
      },
      teamCntChngFree: function () {
        this.cntWaste =
          this.storeSelectedCnt - this.cntSelected - parseInt(this.cntFree);
      },
      tktB2BCheck: function () {
        let ids = this.segDetails
          .filter((x) => x.isCheck == true)
          .map((x) => x.id);
        if (ids.length > 0) {
          fntktB2BCheck(ids, this);
        } else {
          layer.alert("请选择需要B2B占位的订单!", {
            icon: 2,
          });
        }
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
      // 封装的方法
      isNeedCalProfit(airCo, route, flightNo) {
        let calProfit = ap.configs.calProfit;
        if (calProfit.length && calProfit.length > 0) {
          let item = calProfit.filter(
            (x) =>
            x.airCo == airCo &&
            (x.route == "ALL" || x.route.indexOf(route) != -1) &&
            (x.flightNo == "ALL" || x.flightNo.indexOf(flightNo) != -1)
          );
          if (item.length > 0) return true;
        }
        return false;
      },
      caclProfit() {
        let segsSelected = ap.segDetails.filter((x) => x.isCheck == true);
        if (segsSelected.length) {
          ap.profitInfo.rcv = segsSelected.reduce(
            (t, c) => t + c.data.price + c.data.tax,
            0
          );
          console.log(ap.profitInfo);
          let pl = {
            flightNo: segsSelected[0].data.flightNo,
            dateDep: segsSelected[0].data.datDep.replace(/-/g, ""),
          };
        }
      },
      fntktB2BCheck(ids, app) {
        var str = "";
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i];
          var segs = app.segDetails.filter((x) => x.id == id);
          if (segs.length > 0) {
            if (segs[0].data.tktWaste != "") {
              str += segs[0].data.orderNo + ",";
            }
          }
        }
        if (str == "") {
          layer.open({
            title: ["提示"],
            content: '<div style="color:#767676">确定对选中航段做B2B占位?</div>',
            btn: ["确认", "取消"],
            shadeClose: true,
            //回调函数
            yes: function (index, layero) {
              //确认
              fnB2BSubmit(ids, app);
            },
          });
        } else {
          str = str.substr(0, str.length - 1);
          layer.open({
            title: ["提示"],
            content: '<div style="color:#767676">订单号【' +
              str +
              "】已经占位,是否继续占位?</div>",
            btn: ["确认", "取消"],
            shadeClose: true,
            //回调函数
            yes: function (index, layero) {
              //确认
              fnB2BSubmit(ids, app);
            },
          });
        }
      },
      fnB2BSubmit(ids, app) {
        this.axios
          .post("/order/tktB2BIssueApply", {
            ids: ids,
          })
          .then((rtn) => {
            if (rtn.data.code == 0) {
              layer.alert("B2B占位成功!", {
                icon: 6,
              });
              for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var segs = app.segDetails.filter((x) => x.id == id);
                if (segs.length > 0) {
                  segs[0].data.tktWaste = "等待占位";
                }
              }
            } else {
              layer.alert("B2B占位失败!", {
                icon: 5,
              });
            }
          });
      },
    },
  };

  function query(app) {
    app.qry.orderNo = app.qry.orderNo.trim();
    app.qry.tktNo = app.qry.tktNo.trim();
    app.qry.pName = app.qry.pName.trim();
    app.qry.route = app.qry.route.trim().toUpperCase();
    app.qry.airCo = app.qry.airCo.trim().toUpperCase();
    app.qry.flightNo = app.qry.flightNo.trim().toUpperCase();

    // layer.load(2);
    this.axios.post("/order/segDetailQryAll", app.qry).then((rtn) => {
      layer.close(layer.index);
      rtn.data.segDetails.map((x) => (x.isCheck = app.isCheckAll));
      app.segDetails = rtn.data.segDetails;

      if (app.qry.page.idx == 1) {
        this.axios.post("/order/segsTotalGet", app.qry).then((rtn) => {
          app.total = Number(rtn.data);

          app.canExport = true;
          if (app.total > 50000) {
            app.canExport = false;
          }
        });
      }
    });
  }
</script>