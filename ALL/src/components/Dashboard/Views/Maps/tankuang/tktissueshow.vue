<template>
  <div>
    <!-- 点击出票控制台表格中的ID跳转的页面 -->
    <h2 v-if="msg">{{ msg }} 1秒后自动返回</h2>
    <div>
      <table class="mytable">
        <thead>
          <tr>
            <td>出票单号</td>
            <td>类型</td>
            <td>出票PNR</td>
            <td>采购金额外币</td>
            <td>支付账号</td>
            <td>支付流水号 / 卡号</td>
            <td>采购渠道</td>
            <td>出票邮箱</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-if="task.data.type === 'tuan'">{{ task.id }}</td>
            <td v-else>
              <a :href="'/xls/' + task.id + '.xlsx'">{{ task.id }}</a>
            </td>
            <td
              v-text="task.data.type === 'sanke' ? '散客' : task.data.typeStore"
            ></td>
            <td>
              <input
                disabled
                v-if="task.data.type === 'sanke'"
                @keyUp="tktPaste()"
                v-model="task.data.tktIssuePnr"
                style="width: 80px;"
                type="text"
              />
              <span v-if="task.data.type === 'tuan'">
                <a :href="'/xls/' + store.data.pnr + '.xls'">{{
                  store.data.pnr
                }}</a>
              </span>
            </td>
            <td>
              <input
                disabled
                v-model="task.data.payFrn"
                style="width: 90px;"
                type="number"
              />
            </td>
            <td>
              <select disabled v-model="task.data.payAcct">
                <option v-for="item of tktIssuePayTypes">
                  {{ item }}
                </option>
              </select>
            </td>
            <td>
              <input
                disabled
                v-model="task.data.paySerial"
                style="width: 150px;"
                type="text"
              />
            </td>
            <td>
              <div v-if="task.data.type === 'sanke'">
                <select disabled v-model="task.data.tktIssueChannel">
                  <option v-for="item of tktIssueChannels">
                    {{ item }}
                  </option>
                </select>
              </div>
              <div v-if="task.data.type === 'tuan'"></div>
            </td>
            <td>
              <div v-if="task.data.type === 'sanke'">
                <select disabled v-model="task.data.tktIssueMail">
                  <option v-for="item of tktIssueMails">
                    {{ item }}
                  </option>
                </select>
              </div>
              <div v-if="task.data.type === 'tuan'">
                {{ store.data.email }}
              </div>
            </td>
          </tr>
          <tr>
            <td>提票备注:</td>
            <td colspan="7">
              <span style="display: inline-block;width: 400px;">{{
                task.data.tktIssueApplyRmk
              }}</span>
              <input
                disabled
                style="width: 200px;margin-left: 20px;"
                type="text"
                v-model="task.data.tktIssueRmk"
                placeholder="请填写 出票备注"
              />
              <input
                class="btn btn-info btn-sm"
                type="button"
                value=" 返回 "
                @click="back()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <ul class="info1">
        <li>
          <table class="mytable">
            <thead>
              <tr>
                <td>行程</td>
                <td>起飞时间</td>
                <td>航班号</td>
                <td>到达时间</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r of routes">
                <td>{{ r.data.route }}</td>
                <td>{{ r.data.timeDep.substr(0, 16) }}</td>
                <td>
                  {{ r.data.flightNo }}
                  <span style="color:red" v-if="r.flightNo != r.flightNoOrg"
                    >({{ r.data.flightNoOrg }})</span
                  >
                </td>
                <td>
                  {{
                    r.data.timeArr
                      ? r.data.timeArr.substr(0, 16)
                      : r.data.timeArr
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </li>
        <li>
          <table v-if="task.data.type === 'tuan'" class="mytable">
            <thead>
              <tr>
                <td>PNR</td>
                <td>数量</td>
                <td>假</td>
                <td>损</td>
                <td>免</td>
                <td>总价</td>
                <td>押金</td>
                <td>二次支付</td>
                <td>出票应付</td>
                <td>邮件</td>
                <td>公司</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ store.data.pnr }}</td>
                <td>{{ store.data.qty }}</td>
                <td>{{ task.data.cntFake }}</td>
                <td>{{ task.data.cntWaste }}</td>
                <td>{{ task.data.cntFree }}</td>
                <td>{{ store.data.sum }}</td>
                <td>{{ store.data.deposit }}</td>
                <td>{{ store.data.pay2 }}</td>
                <td>
                  {{
                    store.data.sum -
                      parseFloat(store.data.deposit) -
                      parseFloat(store.data.pay2)
                  }}
                </td>
                <td>{{ store.data.email }}</td>
                <td>{{ store.data.company }}</td>
              </tr>
            </tbody>
          </table>
        </li>
      </ul>
    </div>

    <div style="margin-top:10px; ">
      <table>
        <tr>
          <td>
            <table class="mytable">
              <thead>
                <tr>
                  <td>行 <br />程</td>
                  <td>订 <br />舱</td>
                  <td v-if="task.data.type === 'sanke'">出 <br />舱</td>
                  <td>单 <br />价</td>
                  <td>税</td>
                  <td>行 <br />李</td>
                  <td>价 <br />格</td>

                  <td colspan="2">
                    乘机人信息
                    <span style="color: red;">共{{ segs.length }}人</span>
                  </td>
                  <td>证件信息</td>
                  <td>平台订单号</td>
                  <td>原行程</td>
                  <td>票号</td>
                  <td>行李支付 <br />外币</td>
                  <td>占位信息</td>
                </tr>
              </thead>
               <tbody>
                <tr v-for="item of segs">
                  <td>{{ item.data.route }}</td>
                  <td>{{ item.data.cabin }}</td>
                  <td v-if="task.data.type === 'sanke'" class="cabinissue">
                    {{ item.data.cabinIssue }}
                  </td>
                  <td>{{ item.data.price }}</td>
                  <td>{{ item.data.tax }}</td>
                  <td>{{ item.data.bag }}</td>
                  <td>
                    {{ item.data.bagPrice === 0 ? "" : item.data.bagPrice }}
                  </td>
                  <td>
                    {{ item.data.pName }} <br />{{ item.data.gender }}
                    {{ item.data.ageType }} <br />{{ item.data.birthday }}
                  </td>
                  <td>{{ item.data.nation }}</td>
                  <td>
                    {{ item.data.idType }} <br />{{ item.data.idNo }} <br />{{
                      item.data.idExpire
                    }}
                  </td>
                  <td>
                    {{ item.data.src }}
                    <br />
                    <a target="_blank" :href='"/order/orderInfo.htm?orderNo="+item.orderno'> 
                    {{ item.orderno }}
                     </a> 
                  </td>
                  <td>
                    {{ item.data.tripType }}
                  </td>
                  <td>
                    <input
                      :disabled="task.data.type === 'tuan'"
                      style="width:80px;"
                      type="text"
                      v-model="item.data.tktNo"
                    />
                  </td>
                  <td>
                    <input
                      :disabled="task.data.typeStore === '计划位'"
                      v-if="item.data.bag"
                      style="width:80px;"
                      type="number"
                      v-model="item.data.bagIssuePriceFrn"
                    />
                  </td>
                 <td>
                    {{ item.data.tktWaste }}<br />{{ item.data.tktWasteExpire
                    }}<br />{{ item.data.tktWasteAcct }}
                  </td>
                </tr>
              </tbody> 
            </table>
          </td>
          <td>
            <textarea cols="80" rows="8">{{ segAndRoute }}</textarea>
          </td>
        </tr>
      </table>
    </div>

    <div style="margin-top:10px; ">
      <table class="mytable">
        <thead>
          <tr>
            <td>时间</td>
            <td>操作员</td>
            <td>操作内容</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of task.logs">
            <td v-text="item.dat"></td>
            <td v-text="item.oper"></td>
            <td v-text="item.op"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
let taskID = 0;
let logsCnt = 0;
export default {
  data() {
    return {
      msg: "",
      task: "",
      segs: [],
      store: "",
      routes: [],
      isFinish: false,
      isWorking: false,

      tktIssueChannels: "",
      tktIssueMails: "",
      tktIssuePayTypes: "",

      segAndRoute: "",
    };
  },
  mounted() {
    function qryobj() {
      var theRequest = new Object();
      if (location.search.indexOf("?") != -1) {
        var str = location.search.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    }
    this.dataGet(qryobj(location.search), this);
  },
  methods: {
    issueInfoSave(isDone) {
      this.isWorking = true;
      this.task.isDone = isDone;
      this.task.data.priceBagFrn = this.segs.reduce(
        (t, c) => t + parseFloat(c.data.bagIssuePriceFrn),
        0
      );

      this.axios
        .post("/order/issueInfoSave", {
          task: this.task,
          segs: this.segs,
        })
        .then((rtn) => {
          this.isWorking = false;

          if (isDone) {
            if (rtn.data.code == 0) {
              this.isFinish = true;
              layer.msg("OK", {
                icon: 1,
                time: 500,
              });
              setTimeout(backorClose, 2000);
            } else {
              layer.msg(rtn.data.msg, {
                icon: 5,
                time: 2000,
              });
            }
          } else {
            layer.msg(rtn.data.msg, {
              icon: 1,
              time: 2000,
            });
          }
        });
    },
    issueCancel() {
      this.axios.post("/order/issueCancel", this.task).then((rtn) => {
        console.log(rtn.data);
        if (rtn.data.code == 0) {
          this.isFinish = true;
          layer.msg("OK", {
            icon: 1,
            time: 500,
          });
          setTimeout(backorClose, 2000);
        } else {
          layer.msg(rtn.data.msg, {
            icon: 5,
            time: 2000,
          });
        }
      });
    },
    tktPaste() {
      this.segs.map((x) => (x.data.tktNo = this.task.data.tktNo));
    },
    back() {
      if (top != self) {
        window.history.back();
      } else {
        window.close();
      }
    },
    // 封裝的方法
    dataGet(qry, app) {
      this.axios.post("/order/issueTaskShow", qry).then((rtn) => {
        app.isFinish = rtn.task.data.stat !== "待出票";
        app.msg = rtn.msg;
        if (rtn.code != 0) {
          if (top != self) {
            setInterval(function() {
              window.history.back();
            }, 1000);
          } else {
            setInterval(function() {
              window.close();
            }, 1000);
          }
        } else {
          taskID = rtn.task.id;

          let idx = 0;
          rtn.task.logs.forEach((x) => {
            x.idx = idx++;
            if (!x.op) {
              x.op = "";
            }
          });
          rtn.task.logs.sort((x, y) => (x.idx > y.idx ? -1 : 1));
          logsCnt = rtn.task.logs.length;

          app.task = rtn.task;
          app.segs = rtn.segs;
          app.segs.forEach((s) => {
            if (
              app.routes.filter((r) => r.data.route == s.data.route).length == 0
            )
              app.routes.push(s);
          });
          app.store = rtn.store;
          app.tktIssueChannels = rtn.tktIssueChannels;
          app.tktIssueMails = rtn.tktIssueMails;
          app.tktIssuePayTypes = rtn.tktIssuePayTypes;
          app.tktIssueChannel = app.task.data.tktIssueChannel;
          app.tktIssueMail = app.task.data.tktIssueMail;
          if (!app.task.data.payAcct) {
            app.task.data.payAcct =
              app.task.data.tktIssueChannel === "UO官网"
                ? "Qcard"
                : app.task.data.tktIssueChannel === "UOB2B"
                ? "B2BNGBYH0002"
                : "";
          }
          if (app.task.data.tktNo) {
            app.segs
              .filter((x) => x.data.tktNo === "")
              .map((x) => (x.data.tktNo = app.task.data.tktNo));
          }
          if (app.task.data.type === "tuan") {
            app.segs.map((x) => (x.data.tktNo = app.store.data.pnr));
          }
          this.segAndRouteInfo(app);
        }
      });
    },
    segAndRouteInfo(app) {
      let psgrs = app.segs.filter(
        (x) => x.data.route == app.segs[0].data.route
      );
      psgrs.map((x) => {
        app.segAndRoute +=
          _.deburr(x.data.pName) +
          " " +
          x.data.gender +
          " " +
          x.data.ageType +
          " " +
          x.data.birthday +
          " " +
          x.data.nation +
          " " +
          x.data.idType +
          " " +
          x.data.idNo +
          " " +
          x.data.idExpire +
          "\n";
      });

      app.segAndRoute += "\n";

      let routes = app.segs.filter(
        (x) => x.data.pName == app.segs[0].data.pName
      );
      routes.map((x) => {
        app.segAndRoute +=
          x.data.route +
          " " +
          x.data.timeDep.substr(0, 16) +
          " " +
          x.data.flightNo +
          "\n";
      });
    },
    autoRefesh() {
      console.log(taskID, logsCnt, new Date());
      this.axios
        .post("/order/issueTaskLogsCnt", location.search.qryobj())
        .then((rtn) => {
          console.log(rtn.data);
          if (rtn.data != logsCnt) {
            dataGet(location.search.qryobj(), ap);
          }
        });

      setTimeout(() => {
        autoRefesh();
      }, 1000);
    },
  },
};
</script>

<style>
.mytable {
  border: 1px solid #999;
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
  padding: 3px 4px;
  border: solid 1px #eeeeee;
}

.mytable tbody tr:nth-child(2n) {
  background-color: #f6f6f685;
}

.mytable tbody tr:hover {
  background-color: #d7ddfa;
}

.cabinissue {
  color: red;
  font-weight: bold;
}

.info1 {
  margin: 0px;
  padding: 0px;
  display: table;
  list-style-type: none;
}

.info1 li {
  display: table-cell;
  padding: 10px 10px 0px 0px;
}
</style>
