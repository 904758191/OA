<template>
  <div>
    <div class="card">
      <form class="form-horizontal">
        <div class="card-header">
          <h4 class="card-title">手动数据</h4>
        </div>
        <div class="card-content">
          <a-form :form="form" @submit="handleSubmit">
          <div class="form-group">
            <label class="col-md-3 control-label">航司：</label>
            <div class="col-md-4">
              <input type="text" placeholder="TR" class="form-control" />
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">机场：</label>
            <div class="col-md-8 row">
              <div class="col-md-5">
                <input type="text" placeholder="TR" class="form-control" />
              </div>
              <div class="col-md-2">
                <span class="col-md-1">-</span>
              </div>
              <div class="col-md-5">
                <input type="text" placeholder="TR" class="form-control" />
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">城市：</label>
              <div class="col-md-8 row">
              <div class="col-md-5">
                <input type="text" placeholder="TR" class="form-control" />
              </div>
              <div class="col-md-2">
                <span class="col-md-1">-</span>
              </div>
              <div class="col-md-5">
                <input type="text" placeholder="TR" class="form-control" />
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">航班号</label>
            <div class="col-md-4">
              <input type="text" placeholder="TR" class="form-control" />
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">乘机时间</label>
            <div class="col-md-4">
              <el-date-picker placeholder="起飞时间"></el-date-picker>
            </div>
            <div class="col-md-4">
              <el-date-picker placeholder="降落时间"></el-date-picker>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label" @blur="upperCase">舱位</label>
            <div class="col-md-4">
              <input type="text" placeholder="M1" class="form-control" />
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label" @blur="autoFixAnother('adultPrice', 'childPrice')">成人价</label>
            <div class="col-md-4">
              <input type="text" placeholder="909" class="form-control" />
            </div>
            <div class="col-md-1">
              <label class="control-label">元</label>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label" @blur="autoFixAnother('adultTax', 'childTax')">成人税</label>
            <div class="col-md-4">
              <input type="text" placeholder="100" class="form-control" />
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">儿童价</label>
            <div class="col-md-4">
              <input type="text" placeholder="909" class="form-control" />
            </div>
            <div class="col-md-1">
              <label class="control-label">元</label>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">儿童税</label>
            <div class="col-md-4">
              <input type="text" placeholder="100" class="form-control" />
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">余位</label>
            <div class="col-md-4">
              <input type="text" placeholder="8" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="control-label">待支付：人</label>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">舱等</label>
            <div class="col-md-4">
              <el-select placeholder="经济">
                <el-option>经济</el-option>
                <el-option>超经</el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">机型：</label>
            <div class="col-md-4">
              <input type="text" placeholder="TR" class="form-control" />
            </div>
          </div>
          <!-- 阶梯运价需要修改 -->
          <!-- <div class="form-group">
            <label class="col-md-3 control-label">阶梯运价格式：</label>
            <div class="col-md-8">

            </div>
          </div> -->
          <div class="form-group">
            <label class="col-md-3 control-label">阶梯运价</label>
            <div class="col-md-4">
              <button class="btn btn-primary" @click="add">新增阶梯运价</button>
              <p style="color: red;">* 阶梯运价仅在非更新状态下生效</p>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">更新状态：</label>
            <div class="col-md-4 row">
              <p-radio  label="1" v-model="radios.radio1">是</p-radio>
              <p-radio label="2" v-model="radios.radio1">否</p-radio>
            </div>
          </div>
          <div class="form-group" style="margin-left:80px">
            <button class="btn btn-info btn-fill">提交</button>
            <button class="btn btn-fill" @click="handelCancel">取消</button>
          </div>
        </a-form>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import { DatePicker, TimeSelect, Slider, Tag, Input, radio,Button } from "element-ui";
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
    PSwitch,
    PProgress,
  },
  data(){
    return{
      radios:{
        radio1:'1'
      }
    }
  },
  // 声明周期
  activated() {
    console.log(this.tablesrc);
    if (this.tablesrc == "privateflight") {
      this.adddatatitle = "手动数据";
    } else if (this.tablesrc == "flightapi") {
      this.adddatatitle = "API数据";
    } else if (this.tablesrc == "privateflight_rt") {
      this.adddatatitle = "往返数据";
    }

    this.id = this.$route.params.id;
    this.operate_type = this.$route.query.type;
    const { form } = this;
    if (!this.id) {
      form.resetFields();
      this.jtItems = [];
      return;
    }
    this.init();
    let param = { stockId: this.id };
    if (this.tablesrc == "privateflight_rt") {
      param.extra = "rt_sale";
    }
    getUnPaySeatCount(param).then(res => {
      this.unPay = res.unPaySeatCount || 0;
    });
  },
  // 废用？
  deactivated() {
    const { form } = this;
    form.resetFields();
    this.jtItems = [];
    this.unPay = null;
  },
  methods:{
    // 封装的方法
    init() {
      const { form } = this;
      policyGet({ id: this.id }, this.tablesrc)
        .then(res => {
          if (!res.state) {
            let data = res.data;
            this.data = data;
            console.log(data);
            this.fixInfo(form, data);

            // 获取各个平台的调价
            let adultprice;
            if (data.updateStatus == "0") {
              adultprice = +data.cabins
                .split(";")[0]
                .split(",")
                .pop();
            } else if (data.updateStatus == "1") {
              adultprice = data.adultPrice;
            }
            this.getPlatformsPrice(data, adultprice, data.adultTax);
          } else {
            this.$message.error(res.message, 2);
          }
        })
        .catch(err => {
          this.$message.error("获取信息失败", 2);
        });
    },
    // 表格？？？
    findPrice(platform) {
      return (
        _.find(this.platformsprice, v => v.platform == platform).price || "null"
      );
    },
    // 封装的方法
    getPlatformsPrice(data, adultprice, adulttax) {
      console.log(adulttax);
      let param = {
        airCo: data.airCo,
        // "depAirport": data.depAirPort,
        // "arrAirport": data.arrAirPort,
        depCity: data.depCity,
        arrCity: data.arrCity,
        flightNumber: data.flightNumber,
        depDate: data.depDate
        // "adultTax": adulttax,
        // "adultPrice": adultprice
      };
      policyPriceGet(param)
        .then(res => {
          console.log(res);
          if (res.err) {
            this.$message.error("search查询失败, 请稍后再试");
          } else {
            this.platformsprice = res.data;
          }
          // this.platformsprice = res.results;
        })
        .catch(err => {
          this.$message.error("search查询失败, 请稍后再试");
        });
    },
    // 封装的函数
    calculateYw(items) {
      return _.map(items, (v, i, arr) => {
        let tmp = v;
        tmp.yw2 = _.chain(arr)
          .filter((vv, ii) => {
            return i >= ii;
          })
          .map(vv => +vv.yw)
          .reduce((memo, num) => {
            return memo + num;
          }, 0)
          .value();
        return tmp;
      });
    },
    // 余位blur事件
    bulrYw(yw) {
      this.jtItems = this.calculateYw(this.jtItems);
      if (yw > 30) {
        this.$warning({
          title: "高风险输入",
          content: "输入的余位 >30，请核查"
        });
        return false;
      }
    },
    // 阶梯运价
    add() {
      const { form } = this;
      this.jtItems.push({ cabin: "", yw: 0, yw2: 0, price: 0 });
      form.setFieldsValue({ updateStatus: "0" });
    },
    // 价格blur事件
    bulrPrice(price) {
      if (price < 100) {
        this.$warning({
          title: "高风险输入",
          content: "输入的票面价格 <100，请核查"
        });
        return false;
      }
      let adultprice = +this.jtItems[0].price;
      const { form } = this;
      let adulttax = form.getFieldValue("adultTax");
      // this.getPlatformsPrice(this.data, adultprice, +adulttax);
    },
    // 价格小图标
    remove(k) {
      this.jtItems = _.filter(this.jtItems, (v, i) => i !== k);
      this.jtItems = this.calculateYw(this.jtItems);
    },
    // 成人价，成人税的blur事件
    autoFixAnother(source, aim) {
      const { form } = this;
      let srcvalue = form.getFieldValue(source);
      let aimvalue = form.getFieldValue(aim);

      console.log(srcvalue);

      if (source == "adultTax") {
        let adultTax = +srcvalue;
        let updateStatus = form.getFieldValue("updateStatus");
        // 获取各个平台的调价
        let adultPrice;
        if (updateStatus == "0") {
          if (this.jtItems.length >= 1 && this.jtItems[0].price) {
            adultPrice = +this.jtItems[0].price;
          } else {
            this.platformsprice = [];
            return;
          }
        } else if (updateStatus == "1") {
          adultPrice = form.getFieldValue("adultPrice");
        }
        // this.getPlatformsPrice(this.data, adultPrice, adultTax);
      }
      if (source == "adultPrice") {
        let adultPrice = +srcvalue;
        let updateStatus = form.getFieldValue("updateStatus");
        // 获取各个平台的调价
        let adultTax;
        if (updateStatus == "1") {
          adultTax = form.getFieldValue("adultTax");
        } else if (updateStatus == "0") {
          return;
        }
        // this.getPlatformsPrice(this.data, adultPrice, adultTax);
      }

      if (aimvalue) return;
      form.setFieldsValue({ [aim]: srcvalue });
    },
    // 封装函数
    fixInfo(form, data) {
      form.setFieldsValue({
        airCo: data.airCo,
        depAirPort: data.depAirPort,
        arrAirPort: data.arrAirPort,
        depCity: data.depCity,
        arrCity: data.arrCity,
        flightNumber: data.flightNumber,
        cabin: data.cabin,
        adultPrice: data.adultPrice,
        adultTax: data.adultTax,
        childPrice: data.childPrice,
        childTax: data.childTax,
        seatCount: data.seatCount,
        tripTime: [
          moment(data.depTime, "YYYY-MM-DD HH:mm"),
          moment(data.arrTime, "YYYY-MM-DD HH:mm")
        ],
        flightType: data.flightType,
        updateStatus: data.updateStatus,
        cabinClass: data.cabinClass || "0"
      });
      if (data.cabins) {
        let tmpcabins = data.cabins.replace(/;$/, ""); // 去除末尾的;号
        let tmparr = tmpcabins.split(";");
        this.jtItems = _.map(tmparr, v => {
          let tmp = v.split(",");
          return {
            cabin: tmp[0],
            yw: tmp[1],
            yw2: tmp[2],
            price: tmp[3]
          };
        });
      } else {
        this.jtItems = [];
      }
    },
    upperCase() {
      this.jtItems = _.map(this.jtItems, v => {
        v.cabin = v.cabin.toUpperCase();
        return v;
      });
    },
    // 用作验证
    toCap(e) {
      return e.target.value.toUpperCase();
    },
    // 点击取消和返回，返回上一页
    handleCancel(e) {
      this.$router.go(-1);
    },
    // 提交总表单
    handleSubmit(e) {
      e.preventDefault();
      const { form } = this;
      form.validateFields((err, values) => {
        this.loading = true;
        if (!err) {
          let packdata = values;
          packdata.depTime = packdata.tripTime[0].format("YYYYMMDDHHmm");
          packdata.arrTime = packdata.tripTime[1].format("YYYYMMDDHHmm");

          packdata = objectTrim(packdata);

          let _this = this;
          // 阶梯运价检验
          function jtcheck(arr) {
            let check = true;
            // 判断阶梯运价输入信息是否正确
            _.each(arr, v => {
              if (!/^[A-Z0-9]{1,2}$/.test(v.cabin)) {
                _this.$message.error("舱位格式有误", 3);
                check = false;
                return;
              }
              if (!v.yw) {
                if (v.yw < 0) {
                  _this.$message.error("余位格式有误", 3);
                  check = false;
                  return;
                }
              }
              if (!v.price || +v.price <= 0) {
                _this.$message.error("票面价格格式有误", 3);
                check = false;
                return;
              }
            });
            return check;
          }

          this.jtItems = this.calculateYw(this.jtItems);
          let jtarr = this.jtItems;
          let updatestate = form.getFieldValue("updateStatus");
          if (jtarr.length == 0) {
            if (updatestate == 0) {
              this.$message.error("非更新状态下必须输入阶梯运价", 2);
              return;
            }
          }
          if (!jtcheck(jtarr)) {
            // this.$message.error('请检查阶梯运价输入格式', 5);
            return;
          }

          if (this.jtItems.length > 0) {
            packdata.cabins =
              _.map(this.jtItems, v => {
                return `${v.cabin},${v.yw},${v.yw2},${v.price}`;
              }).join(";") + ";";
          } else if (this.jtItems.length == 0) {
            packdata.cabins = "";
          }

          if (this.id && this.operate_type === "fixed") {
            let json = objectDiff(packdata, this.data);
            json.id = +this.id;
            json.airCo = packdata.airCo;
            policyUpdate(json, this.tablesrc)
              .then(res => {
                if (!res.state) {
                  this.$message.success("修改成功", 2);
                  // window.location.reload();
                  this.init();
                  this.getPlatformsPrice(this.data);
                  // this.$router.go(-1);
                } else {
                  this.$message.error(res.message, 2);
                }
              })
              .catch(err => {
                this.$message.error("修改失败", 2);
              })
              .finally(() => {
                this.loading = false;
              });
            return;
          }
          console.log(packdata);
          policyAdd(packdata, this.tablesrc)
            .then(res => {
              if (!res.state) {
                this.$message.success("新增成功", 2);
                this.$router.go(-1);
              } else {
                this.$message.error(res.message, 2);
              }
            })
            .catch(err => {
              this.$message.error("新增失败", 2);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>
