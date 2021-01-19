<template>
  <div>
    <div>
      <form @submit.prevent="submit">
        <div class="form-group col-md-2">
          <a-form-item>
            <label class="form-label">航段</label>
            <input type="text" class="form-control" />
          </a-form-item>
        </div>
        <div class="form-group col-md-2">
          <a-form-item>
            <label class="form-label">起飞日期</label>
            <el-date-picker placeholder="起飞日期"></el-date-picker>
          </a-form-item>
        </div>
        <div class="form-group col-md-2">
          <a-form-item>
            <label class="form-label">航班号</label>
            <input type="text" class="form-control" />
          </a-form-item>
        </div>
        <div class="form-group col-md-2">
          <a-form-item>
            <label class="form-label">航司</label>
            <input type="text" class="form-control" />
          </a-form-item>
        </div>
        <button class="btn btn-info btn-fill">查询</button>
      </form>
      <!-- 页面初始化时加载的表格 -->
      <el-table-column>
        <el-table-column prop="route" label="航段"></el-table-column>
        <el-table-column prop="segwait" label="未出"></el-table-column>
      </el-table-column>
    </div>
    <div>
      <div class="form-group col-md-2">
        <a-form-item>
          <label class="form-label">过票状态</label>
          <el-select>
            <el-option value="1" label="未出"></el-option>
          </el-select>
        </a-form-item>
      </div>
      <div>
        <a-form-item>
          <p-checkbox>排除当天已过票</p-checkbox>
        </a-form-item>
      </div>
      <div>
        <p-radio>全部</p-radio>
        <p-radio>仅显示无库存</p-radio>
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
            label: "ID"
          },
          {
            prop: "data.route",
            label: "航段"
          },
          // 可点击 XXX
          {
            prop: "data.datDep",
            label: "起飞日期"
          },
          {
            prop: "data.flightNo",
            label: "航班号"
          },
          {
            prop: "data.segAll",
            label: "总收"
          },
          {
            prop: "data.segWait",
            label: "未出"
          },
          // 可点击
          {
            prop: "shengyu",
            label: "库存"
          },
          {
            prop: "cabinw  seatw",
            label: "外放"
          },
          {
            prop: "apicabinw apiseatw",
            label: "ＡＰＩ外放"
          },
          {
            prop: "cabinload",
            label: "上座率"
          },
          // 重写
          {
            prop: "item.tktcheck?item.tktcheck.cabintmp:"
            "",
            label: "临团"
          },
          {
            prop: "availableSeat",
            label: "余位"
          },
          // 重写
          {
            prop: "",
            label: "舱位小计"
          },
          {
            prop: "",
            label: "过票记录"
          },
          {
            prop: "",
            label: "降舱"
          },
          {
            prop: "",
            label: "降舱时间"
          },
          {
            prop: "",
            label: "占位最近时间"
          },
          {
            prop: "",
            label: "操作"
          }
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
      }
    },
    method: {
      // 用于提交form表单
      submit: function () {
        // search是查询的意思
        search(this)
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
          this.segsFilted = this.segsFilted.filter((x) => x.tktcheck.stat == this.chkStatSelected)
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
          this.segsFilted = this.segsFilted.filter((x) => x.shengyu >= 0)
        }
        // 仅显示无库存的单选按钮
        if (this.filterShengyu == "-1") {
          this.segsFilted = this.segsFilted.filter((x) => x.shengyu < 0)
        }
      },
      // 触发航段中表格事件的加载
      sortBy: function (col) {
        [this.sort1, this.sort2] = [this.sort2, this.sort1];
        this.segsFilted.sort((x, y) => x[col] > y[col] ? this.sort1 : this.sort2)
      },
      //上座率
      loadTrendGet: function (flightNo, datDep) {
        loadTrendGet({
          flightNo: flightNo,
          datDep: datDep,
        }, this);
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
    }
  };
</script>