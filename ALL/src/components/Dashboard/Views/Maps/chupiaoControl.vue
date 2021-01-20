<template>
  <div>
    <div class="row">
      <div class="col-md-2">
        <label class="form-label">订单号</label>
        <input type="text" class="form-control" v-model="filterOrderNo" @keyUp="orderNoFilter()" />
      </div>
      <div class="col-md-2">
        <label class="form-label">姓名</label>
        <input type="text" class="form-control" @keyUp="pNamesFilter()" v-model="filterPsgrName" />
      </div>
    </div>

    <ul style="margin: 10px 0px 0px 0px;">
      <li v-bind:class="{ issueTypecur: scope.key === issueTypeCur }" @click="issueTypeClick(scope.key)"
        v-for="(scope,index) in issueTypes" :key="index">
        {{ scope.type }} - {{ scope.cnt }}-{{ scope.total }}
      </li>
    </ul>
    <el-progress v-show="isAutoRefesh" :show-text="false" :percentage="percent" style="width:1000px;" color="#8e71c7">
    </el-progress>
    <ol class="airsCnt">
      <li v-for="air of airCos" @click="airCoCurChng(air)" :key="air">
        <span> {{ air.airCo }} : {{ air.cnt }} </span>
      </li>
    </ol>
    <el-table :data="tasksFilted" border>
      <el-table-column type="selection"></el-table-column>
      <el-table-column width="40">
        <template slot-scope="scope">
          {{ scope.row.data.type === "sanke" ? "散" : scope.row.data.typeStore }}
        </template>
      </el-table-column>
      <el-table-column label="ID">
        <template slot-scope="scope">
          <!-- <a target="_blank" :href="'/order/tktissueshow.htm?id='+scope.id+'&r='+Math.random()">  -->
          {{ scope.row.id }}
          <!-- </a>  -->
        </template>
      </el-table-column>
      <el-table-column label="行程">
        <template slot-scope="scope">
          {{ scope.row.data.route }}
          <span class="tag red" v-if="scope.row.data.isUrgent">急</span>
          <span class="tag auto" v-if="scope.row.data.isAuto">自</span>
          <span class="tag autoerror" v-if="scope.row.data.isOrderCancel">取消</span>
          <span class="tag autoerror" v-if="scope.row.data.isAutoError">失败</span>
          <span class="tag waste" v-if="scope.row.data.tktWaste">占</span>
        </template>
      </el-table-column>
      <el-table-column label="航班号">
        <template slot-scope="scope">
          {{ scope.row.data.flightNo }}
        </template>
      </el-table-column>
      <el-table-column label="起飞日期">
        <template slot-scope="scope">
          {{ scope.row.data.datDep }}
        </template>
      </el-table-column>
      <el-table-column label="人数" width="60">
        <template slot-scope="scope">
          {{ scope.row.data.segIds.length }}
        </template>
      </el-table-column>
      <el-table-column label="出票渠道/PNR">
        <template slot-scope="scope">
          <span> {{ scope.row.data.tktIssueChannel }} </span>
          <span v-if="scope.row.data.tktIssuePnr">
            {{ scope.row.data.tktIssuePnr }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="提交人">
        <template slot-scope="scope">
          {{ scope.row.data.oper }}
        </template>
      </el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          {{ scope.row.data.timeApply.substr(2, 14) }}
        </template>
      </el-table-column>
      <el-table-column label="出票效率">
        <template slot-scope="scope">
          {{ scope.row.data.timeCost }}
        </template>
      </el-table-column>
      <el-table-column label="倒计时截止时间">
        <template slot-scope="scope">
          {{ scope.row.data.countdown == "9999" ? "" : scope.row.data.countdown }}
        </template>
      </el-table-column>
      <el-table-column label="锁单">
        <template slot-scope="scope">
          <a :href='"/order/tktissue.htm?id="+scope.row.id+"&r="+Math.random()' v-if="scope.row.data.locker===oper">出
            票</a>
          <span class="unlockspan" @click="unlock(scope.row.id, 0)" v-if="scope.row.data.locker === oper">解锁</span>
          <a :href='"/order/tktissue.htm?id="+scope.row.id' v-if="scope.row.data.locker===''">锁单</a>
          <span>{{ scope.row.data.locker }}</span>
          <!-- <span class="unlockspan1" @click="unlock(scope.row.id, 1)" v-if="
              scope.row.data.locker !== '' &&
                scope.row.data.locker !== oper &&
                configs.operAuth.includes('出票台强制解锁')
            ">
            强制解锁</span> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        configs: "",
        filterOrderSrc: "",

        airCos: [],
        airCoCur: "",
        isAutoRefesh: false,
        percent: 0,
        issueTypeCur: window.localStorage["issueTypeCur"] || "sanke",
        oper: "",
        filterOrderNo: "",
        filterPsgrName: "",
        locker: "-",
        tasks: [],
        tasksFilted: [],
        issueTypes: [{
            key: "sanke",
            type: "散客待出票",
            cnt: 0,
            total: 0,
          },
          {
            key: "tuan",
            type: "团队待出票",
            cnt: 0,
            total: 0,
          },
          {
            key: "auto",
            type: "自动出票中",
            cnt: 0,
            total: 0,
          },
          {
            key: "tktCB",
            type: "待回填",
            cnt: 0,
            total: 0,
          },
          {
            key: "myself",
            type: "我的锁单",
            cnt: 0,
            total: 0,
          },
        ],
        sortAsc: false,
      };
    },
    mounted: function (tp) {
      this.axios.post('/order/issueTaskGet', {
        tp
      }).then((res) => {
        this.oper = res.oper
        this.tasksFilted = res.orders
      })
      // dataGet(this);
      // refesh();
      // this.axios.post('/order/issueTaskGet').then(rtn => {
      // this.configs = rtn.configs;
      // this.tasksFilted=rtn.orders
      // })
    },
    methods: {
      sort: function (col) {
        this.sortAsc = !this.sortAsc;
        // console.log(this.sortAsc);
        this.tasksFilted.sort(by(col, 'data', this.sortAsc, ''))
      },
      airCoCurChng: function (air) {
        console.log(air);
        if (air.airCo == 'ALL') {
          if (this.issueTypeCur == 'tktCB') {
            this.tasksFilted = this.tasks.filter(x => x.data.isWaitTktCB == true || x.data.locker === this.locker);
          } else if (this.issueTypeCur == 'myself') {
            this.tasksFilted = this.tasks.filter(x => ((x.data.type === this.issueTypeCur || x.data.locker == this
              .locker) && x.data.isWaitTktCB == false));
          } else {
            this.tasksFilted = this.tasks.filter(x => x.data.type === this.issueTypeCur || x.data.locker === this
              .locker)
          }
        } else {
          if (this.issueTypeCur == 'tktCB') {
            this.tasksFilted = this.tasks.filter(x => (x.data.isWaitTktCB == true && x.data.flightNo.startsWith(air
              .airCo)));
          } else if (this.issueTypeCur == 'myself') {
            this.tasksFilted = this.tasks.filter(x => (((x.data.type === this.issueTypeCur || x.data.locker == this
              .locker) && x.data.isWaitTktCB == false) && x.data.flightNo.startsWith(air.airCo)));
          } else {
            this.tasksFilted = this.tasks.filter(x => x.data.type == this.issueTypeCur && x.data.flightNo.startsWith(
              air.airCo))
          }
          console.log(this.tasksFilted);
        }
      },
      issueTypeClick: function (tp) {
        console.log(tp);
        this.filterOrderNo = '';
        this.filterPsgrName = '';

        window.localStorage['issueTypeCur'] = tp

        this.issueTypeCur = tp;
        if (tp === "auto") {
          this.locker = 'auto'
        } else if (tp === 'myself') {
          this.locker = this.oper
        } else {
          this.locker = '!!'
        }

        dataGet(this, tp);

      },
      unlock: function (id, force) {
        unlock(id, force, this);
      },
      orderNoFilter: function () {
        this.filterOrderNo = this.filterOrderNo.trim();
        this.tasksFilted = this.tasks.filter(x => x.data.orderNos.includes(this.filterOrderNo));
        if (this.filterOrderNo.length == 0 && this.filterPsgrName.length == 0) {
          dataGet(this);
        }
      },
      pNamesFilter: function () {
        this.filterPsgrName = this.filterPsgrName.trim();
        this.tasksFilted = this.tasks.filter(x => x.data.pNames.toUpperCase().includes(this.filterPsgrName));
        if (this.filterOrderNo.length == 0 && this.filterPsgrName.length == 0) {
          dataGet(this);
        }
      },
      orderSrcFilter: function () {
        this.tasksFilted = this.tasks;
        if (this.filterOrderSrc) {
          this.tasksFilted = this.tasks.filter(x => x.data.orderSrcs.includes(this.filterOrderSrc))
        }
      },
      autoRefesh: function () {
        this.percent = 0
        if (this.isAutoRefesh) {
          refesh(this);
        }
      },


    }
  }

  function diff(total) {
    let isNagitive = false;
    if (total < 0) {
      isNagitive = true;
      total = 0 - total;
    }
    let days = Math.floor(total / (24 * 3600 * 1000)) //计算出相差天数
    let leave1 = total % (24 * 3600 * 1000) ////计算出小时数  计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000))
    let leave2 = leave1 % (3600 * 1000) //计算相差分钟数 //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000))
    let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数  //计算相差秒数
    let seconds = Math.round(leave3 / 1000)
    return (isNagitive == true ? "-" : "") + ('0' + (days * 24 + hours)).slice(-2) + ":" + ('0' + minutes).slice(-2) +
      ":" + ('0' + seconds).slice(-2);
  }

  function dataGet(app, tp) {
    this.axios.post('/api/order/issueTaskGet', {
      tp
    }).then(rtn => {
      app.oper = rtn.data.oper;

      rtn.data.orders.map(x => {
        x.timeCost = '-';
        x.data.orderNos = x.data.orderNos.join();
        x.data.pNames = x.data.pNames.join();
        if (!x.data.countdown) {
          x.data.countdown = '9999'
        }
      })
      rtn.data.orders.sort(by('countdown', 'data', 1, by('isUrgent', 'data', 0, by('timeApply', 'data', 1))))

      app.airCos = [];
      let airCosTmp = Array.from(new Set(rtn.data.orders.filter(x => x.data.type == app.issueTypeCur).map(x => x
        .data.flightNo.substr(0, 2))))
      if (app.issueTypeCur == 'tktCB') {
        airCosTmp = Array.from(new Set(rtn.data.orders.filter(x => x.data.isWaitTktCB == true).map(x => x.data
          .flightNo.substr(0, 2))));
      } else if (app.issueTypeCur == 'myself') {
        airCosTmp = Array.from(new Set(rtn.data.orders.filter(x => {
          return ((x.data.type == app.issueTypeCur || x.data.locker == app.locker) && x.data.isWaitTktCB ==
            false);
        }).map(x => x.data.flightNo.substr(0, 2))));
        // app.tasksFilted = app.tasks.filter(x => (x.data.type === app.issueTypeCur || x.data.locker === app.locker) && x.data.isWaitTktCB == false)
      }
      airCosTmp.sort();
      if (app.issueTypeCur == 'tktCB') {
        airCosTmp.map(x => {
          app.airCos.push({
            airCo: x,
            cnt: rtn.data.orders.filter(o => o.data.flightNo.startsWith(x) && o.data.isWaitTktCB == true)
              .length,
          });
        });
        app.airCos.push({
          airCo: "ALL",
          cnt: rtn.data.orders.filter(o => o.data.isWaitTktCB == true).length,
        })
      } else if (app.issueTypeCur == 'myself') {
        airCosTmp.map(x => {
          app.airCos.push({
            airCo: x,
            cnt: rtn.data.orders.filter(o => (o.data.flightNo.startsWith(x) && ((o.data.type == app
              .issueTypeCur || o.data.locker == app.locker) && o.data.isWaitTktCB == false))).length,
          });
        });
        app.airCos.push({
          airCo: "ALL",
          cnt: rtn.data.orders.filter(o => ((o.data.type == app.issueTypeCur || o.data.locker == app.locker) &&
            o.data.isWaitTktCB == false)).length,
        })
      } else {
        airCosTmp.map(x => {
          app.airCos.push({
            airCo: x,
            cnt: rtn.data.orders.filter(o => o.data.flightNo.startsWith(x) && o.data.type == app
              .issueTypeCur).length,
          });
        });
        app.airCos.push({
          airCo: "ALL",
          cnt: rtn.data.orders.filter(o => o.data.type == app.issueTypeCur).length,
        })
      }

      let c = rtn.data.orders.filter(x => x.data.type === 'sanke' && x.data.stat == '待出票')
      if (c.length) {
        app.issueTypes.filter(x => x.key === 'sanke')[0].cnt = c.length;
        app.issueTypes.filter(x => x.key === 'sanke')[0].total = c.reduce((t, c) => t + c.data.segIds.length, 0);
      }

      c = rtn.data.orders.filter(x => x.data.type === 'tuan')
      if (c.length) {
        app.issueTypes.filter(x => x.key === 'tuan')[0].cnt = c.length;
        app.issueTypes.filter(x => x.key === 'tuan')[0].total = c.reduce((t, c) => t + c.data.segIds.length, 0);
      }

      c = rtn.data.orders.filter(x => x.data.locker === 'auto')
      if (c.length) {
        app.issueTypes.filter(x => x.key === 'auto')[0].cnt = c.length;
        app.issueTypes.filter(x => x.key === 'auto')[0].total = c.reduce((t, c) => t + c.data.segIds.length, 0);
      }
      c = rtn.data.orders.filter(x => x.data.locker === app.oper)
      if (c.length) {
        app.issueTypes.filter(x => x.key === 'myself')[0].cnt = c.length;
        app.issueTypes.filter(x => x.key === 'myself')[0].total = c.reduce((t, c) => t + c.data.segIds.length, 0);
      }
      c = rtn.data.orders.filter(x => x.data.isWaitTktCB === true)
      console.log(c);
      if (c.length) {
        app.issueTypes.filter(x => x.key === 'tktCB')[0].cnt = c.length;
        app.issueTypes.filter(x => x.key === 'tktCB')[0].total = c.reduce((t, c) => t + c.data.segIds.length, 0);
      }

      app.tasks = rtn.data.orders;

      if (app.tasks.length > 0) {
        app.tasks.map(function (x) {
          let cost = new Date().getTime() - new Date(x.data.timeApply).getTime();
          x.data.timeCost = diff(cost)
        })
      }
      setInterval(function () {
        if (app.tasks.length > 0) {
          app.tasks.map(function (x) {
            let cost = new Date().getTime() - new Date(x.data.timeApply).getTime();
            x.data.timeCost = diff(cost)
          })
        }
      }, 1000);


      if ("sanke tuan auto myself".indexOf(app.issueTypeCur) >= 0) {
        app.tasksFilted = app.tasks.filter(x => (x.data.type === app.issueTypeCur || x.data.locker === app
          .locker) && x.data.isWaitTktCB == false)
      } else if ("tktCB".indexOf(app.issueTypeCur) >= 0) {
        app.tasksFilted = app.tasks.filter(x => x.data.isWaitTktCB == true)
      }


    })
  }

  function unlock(id, force, app) {
    this.axios.post('/api/order/unlock', {
      id,
      force
    }).then(rtn => {
      if (rtn.data.code == 0) {
        layer.msg('搞定', {
          icon: 1,
          time: 2000
        });

        let t = app.tasks.filter(x => x.id == id)
        if (t.length) {
          t[0].data.locker = ''
        }
      } else {
        layer.msg(rtn.data.msg, {
          icon: 5,
          time: 3000
        });
      }
    })
  }

  function refesh() {
    if (ap) {
      if (ap.isAutoRefesh) {
        ap.percent += 10;
        // console.log(ap.percent);
        if (ap.percent >= 101) {
          ap.percent = 0;

        }
      } else {
        ap.percent = 0;
      }
    }
    setTimeout(refesh, 100);

  }
</script>
<style scoped>
  body {
    padding: 10px;
  }

  .mytable {
    border: 1px solid #999;
    /* margin: 0px 5px; */
    /* border-collapse: collapse; */
    /* width: 100%; */
  }

  .mytable thead tr {
    color: darkslateblue;
    background-color: rgb(247, 252, 255);
    padding: 5px 6px;
    font-weight: bold;
    /* text-align: center; */
    font-size: 1.1em;
  }

  .mytable td {
    padding: 3px 6px;
  }

  .mytable tbody tr:nth-child(2n) {
    background-color: #f6f6f6;
  }

  .mytable tbody tr:hover {
    background-color: #d7ddfa;
  }

  .btn {
    cursor: pointer;
    padding: 5px;
  }

  ul {
    list-style-type: none;
    padding: 0px;
    margin: 10px 0px;
    width: 1000px;
    border-bottom: solid 2px rgb(197, 241, 247);
    height: 30px;
  }

  ul li {
    float: left;
    margin: 0px 10px 0px 5px;
    padding: 5px 15px;
    border-radius: 1px 10px 0px 0px;
    cursor: pointer;
  }

  .issueTypecur {
    background-color: rgb(197, 241, 247);
  }

  .unlockspan {
    cursor: pointer;
    color: blue;
    margin-left: 20px;
  }

  .unlockspan1 {
    cursor: pointer;
    color: blue;
  }

  .airsCnt {
    list-style: none;
    /* display: table;     */
    margin: 0px;
    padding: 0px;
  }

  .airsCnt li {
    display: table-cell;
    padding: 3px 20px;
    /* border: solid 1px red; */
  }

  .airsCnt span {
    /* background-color: #d7ddfa; */
    padding: 1px 5px;
    cursor: pointer;
  }

  .red {
    color: red;
  }

  .blue {
    color: blue;
  }

  .tag {
    display: inline-block;
    line-height: 16px;
    padding: 1px 2px;
  }

  .waste {
    background-color: aqua;
    border: dotted 1px brown;
    color: brown;
  }

  .auto {
    background-color: chartreuse;
    border: dotted 1px blue;
    color: blue;
  }

  .autoerror {
    background-color: yellow;
    border: dotted 1px red;
    color: red;
  }
</style>