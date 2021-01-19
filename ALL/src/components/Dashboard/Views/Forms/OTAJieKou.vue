<template>
  <!-- OTA搜索接口验证 -->
  <div>
    <!-- 第一行 -->
    <div class="row">
      <div class="col-md-1">
        <label>平台</label>
        <el-select
          placeholder="携程"
          v-model="searchCondition['otaPlatform']"
          @change="platformChange(searchCondition)"
        >
          <el-option
            v-for="(item, key) in otaPlatformList"
            :value="item['name']"
            :key="key"
          ></el-option>
        </el-select>
      </div>
      <div class="col-md-1">
        <label>马甲</label>
        <el-select placeholder="捷运廉航">
          <el-option value label="捷运廉航"></el-option>
          <el-option value="0" label="甬航空位"></el-option>
          <el-option value="1" label="捷运普通"></el-option>
        </el-select>
      </div>
      <div class="col-md-1">
        <label>行程类型</label>
        <el-select placeholder="全部">
          <el-option value="0" label="单程"></el-option>
          <el-option value="1" label="往返"></el-option>
        </el-select>
      </div>
      <div class="col-md-1">
        <label>人数</label>
        <el-select placeholder="1">
          <el-option label="1"></el-option>
          <el-option label="2"></el-option>
          <el-option label="3"></el-option>
        </el-select>
      </div>
      <div class="col-md-1">
        <label>出发城市</label>
        <input type="text" class="form-control" placeholder="TPE" />
      </div>
      <div class="col-md-1">
        <label>到达城市</label>
        <input type="text" class="form-control" placeholder="TPE" />
      </div>
      <div class="col-md-1">
        <label>去程日期</label>
        <el-date-picker></el-date-picker>
      </div>
      <div class="col-md-1">
        <label>返程日期</label>
        <el-date-picker></el-date-picker>
      </div>
    </div>
    <div class="row">
      <button class="col-md-1 btn btn-info btn-fill">搜索</button>
      <button class="col-md-1 btn btn-info btn-fill">验价</button>
      <button class="col-md-1 btn btn-info btn-fill">生单</button>
    </div>
  </div>
</template>
<script>
// 外部引入
import connector from "@/service/connector";
import { v4 as uuidv4 } from "uuid";
import ErrorModal from "@/components out/ErrorModal";
// 样式框架
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
import PPagination from "src/components/UIComponents/Pagination.vue";

export default {
  name: "OtaSearch",
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
    PPagination,
    // 外部引入
    ErrorModal,
  },
  data() {
    return {
      searchCondition: {
        cid: "jy",
        childNum: 0,
        fromCity: "TPE",
        toCity: "MFM",
        fromDate: "2020-07-01",
        retDate: "",
        tripType: this.$store.state.constant.tripType.oneWay.value,
        adultNum: 1,
      },
      dataList: [],
      page: {
        pageSize: 20,
        resultCount: 0,
        totalPage: 1,
        firstPage: 1,
        lastPage: 1,
        previousPage: 1,
        nextPage: 1,
      },
      data: {},
      spendTime: 0,
      interfaceName: "",
      step: 0,
      traceId: "",
      responseMessage: "",
      otaConfigList: [],
      otaPlatformList: [],
      // 用户选择了平台之后,计算相应的马甲数据
      otaUserList: [],
    };
  },
  mounted() {
    let requestData = { page: { pageSize: 100, currentPage: 1 } };
    this.searchCondition["otaPlatform"] = "";
    connector
      .gatewaySericeAxios()
      .post("/ota_config/list.do", requestData)
      .then((resp) => {
        let _selectOtaConfig;
        this.otaConfigList = resp["data"]["list"];
        this.otaConfigList.forEach((otaConfig) => {
          let add = true;
          for (let index in this.otaPlatformList) {
            if (this.otaPlatformList[index]["name"] === otaConfig["name"]) {
              add = false;
              break;
            }
          }
          if (add) {
            this.otaPlatformList.splice(
              this.otaPlatformList.length,
              0,
              otaConfig
            );
          }
          if (!_selectOtaConfig) {
            if (otaConfig["name"] === "ctrip") {
              _selectOtaConfig = otaConfig;
            }
          }
        });
        this.searchCondition["otaPlatform"] = "ctrip";
        this.platformChange(this.searchCondition);
      });
  },
  methods: {
    search(currentPage) {
      this.dataList = [];
      this.interfaceName = "搜索";
      this.responseMessage = "";
      this.spendTime = 0;
      this.traceId = uuidv4();
      let startTime = new Date().getMilliseconds();
      this.page["currentPage"] = currentPage;
      if (
        this.searchCondition.tripType ==
        this.$store.state.constant.tripType.oneWay.value
      ) {
        this.searchCondition.retDate = "";
      }
      let requestData = JSON.parse(JSON.stringify(this.searchCondition));
      if (requestData["otaPlatform"] == "meituan") {
        requestData["reqId"] = 123324456332233;
        requestData["reqAddition"] = "";
      }
      delete requestData["otaPlatform"];
      delete requestData["otaUserName"];
      requestData["fromDate"] = requestData["fromDate"].replace(
        new RegExp("-", "g"),
        ""
      );
      requestData["retDate"] = requestData["retDate"].replace(
        new RegExp("-", "g"),
        ""
      );
      connector
        .otaInterfaceAxios()
        .post(
          "/ota_interface/search/" +
            this.searchCondition["otaPlatform"] +
            "/" +
            this.searchCondition["otaUserName"] +
            "?traceId=" +
            this.traceId,
          requestData
        )
        .then((resp) => {
          this.spendTime = new Date().getMilliseconds() - startTime;
          this.dataList = resp["routings"];
          this.responseMessage = JSON.stringify(resp, null, 2);
        });
    },
    platformChange(data) {
      console.log("OtaPlatform", data["otaPlatform"]);
      this.otaUserList = [];
      this.otaConfigList.forEach((otaConfig) => {
        if (otaConfig["name"] === data["otaPlatform"]) {
          this.otaUserList.splice(this.otaUserList.length, 0, otaConfig);
        }
      });
      this.searchCondition["otaUserName"] = "jylh";
    },
    priceVerify() {
      this.responseMessage = "";
      this.interfaceName = "验价";
      this.spendTime = 0;
      if (this.dataList.length === 0) {
        throw {
          type: "DataFormat",
          status: 5,
          message: "未搜索到任保价格数据数, 无法验价!",
        };
      }
      this.traceId = uuidv4();
      let startTime = new Date().getMilliseconds();
      let requestData = {};
      requestData["cid"] = this.searchCondition["otaUserName"];
      requestData["tripType"] = this.searchCondition.tripType;
      requestData["adultNum"] = this.searchCondition.adultNum;
      requestData["childNum"] = 0;

      // 兼容携程的格式, 设置相应的人数
      requestData["referenceId"] = Math.floor(Math.random() * 100000) + 1 + "";
      requestData["reqId"] = Math.floor(Math.random() * 100000);
      requestData["adultNumber"] = this.searchCondition.adultNum;
      requestData["childNumber"] = 0;
      requestData["infantNumber"] = 0;
      requestData["requesttype"] = 1;
      requestData["routing"] = this.dataList[0];
      connector
        .otaInterfaceAxios()
        .post(
          "/ota_interface/price_verify/" +
            this.searchCondition["otaPlatform"] +
            "/" +
            this.searchCondition["otaUserName"] +
            "?traceId=" +
            this.traceId,
          requestData
        )
        .then((resp) => {
          this.spendTime = new Date().getMilliseconds() - startTime;
          this.data = resp["routing"];
          this.responseMessage = JSON.stringify(resp, null, 2);
        });
    },
    orderCreate() {
      let startTime = new Date().getMilliseconds();
      this.interfaceName = "生单";
      this.spendTime = 0;
      let priceVerifyResult = JSON.parse(this.responseMessage);
      console.log("验价返回的信息为:", priceVerifyResult);
      let routing = {};
      routing["data"] = priceVerifyResult["routing"]["data"];
      routing["fromSegments"] = priceVerifyResult["routing"]["fromSegments"];
      routing["retSegments"] = priceVerifyResult["routing"]["retSegments"];

      let requestData = {};
      if (this.searchCondition["otaPlatform"] === "qunar") {
        requestData["cid"] = this.searchCondition["otaUserName"];
        requestData["orderSource"] = 1;
        requestData["tripType"] = this.searchCondition.tripType;
        requestData["sessionId"] = priceVerifyResult["sessionId"];
        requestData["routing"] = routing;
        requestData["passengers"] = [];
        for (let i = 0; i < this.searchCondition.adultNum; i++) {
          requestData["passengers"].push({
            name: "Matrix/Zhang" + i,
            ageType: 0,
            birthday: "19800101",
            gender: "M",
            cardType: "PP",
            cardNum: "G756789" + i,
            cardExpired: "20250101",
            cardIssuePlace: "CN",
            nationality: "CN",
          });
        }
        requestData["contact"] = {
          name: "Kulen/Zhang",
          address: "宁波市宁南北路898号2902",
          postcode: "230232",
          email: "kulen@sc.net",
          mobile: "18612345678",
        };
      } else if (this.searchCondition["otaPlatform"] === "ctrip") {
        requestData["cid"] = this.searchCondition["otaUserName"];
        requestData["ctripOrderId"] = {
          adultOrderId: "2360250238",
          childOrderId: "2360250239",
          infantOrderId: "2360250240",
        };
        requestData["referenceId"] = "5116052316000152592";
        requestData["tripType"] = this.searchCondition.tripType;
        requestData["sessionId"] = "S12345";
        requestData["routing"] = routing;
        requestData["passengers"] = [];
        requestData["contact"] = {
          name: "Kulen/Zhang",
          address: "宁波市宁南北路898号2902",
          postcode: "230232",
          email: "kulen@sc.net",
          mobile: "18612345678",
        };
        requestData["passengerbaggages"] = [];
        for (let i = 0; i < this.searchCondition.adultNum; i++) {
          let p = {
            name: "Matrix/Zhang" + i,
            ageType: 0,
            birthday: "19800101",
            gender: "M",
            cardType: "PP",
            cardNum: "G756789" + i,
            cardExpired: "20250101",
            cardIssuePlace: "CN",
            nationality: "CN",
          };
          requestData["passengers"].push(p);
          let pb = {};
          pb["passengerName"] = p["name"];
          pb["baggages"] = [];
          routing["fromSegments"].forEach((fs) => {
            let baggage = {};
            pb["baggages"].push(baggage);
            baggage["flight"] = fs["flightNumber"];
            baggage["fromAirport"] = fs["depAirport"];
            baggage["toAirport"] = fs["arrAirport"];
            baggage["depTime"] = fs["depTime"];
            baggage["cabin"] = fs["cabin"];
            baggage["baggagePrices"] = [];
            baggage["baggagePrices"].push({
              weight: 20,
              bookSalePrice: 100,
              ticketSalePrice: 200,
              airportSalePrice: 300,
              refundFee: 100,
              desc: "",
            });
          });
          requestData["passengerbaggages"].push(pb);
        }
      } else if (this.searchCondition["otaPlatform"] === "taobao") {
        requestData["cid"] = this.searchCondition["otaUserName"];
        requestData["referenceId"] = "5116052316000152592";
        requestData["tripType"] = this.searchCondition.tripType;
        requestData["sessionId"] = "S12345";
        requestData["routing"] = routing;
        requestData["passengers"] = [];
        requestData["contact"] = {
          name: "Kulen/Zhang",
          address: "宁波市宁南北路898号2902",
          postcode: "230232",
          email: "kulen@sc.net",
          mobile: "18612345678",
        };
        for (let i = 0; i < this.searchCondition.adultNum; i++) {
          requestData["passengers"].push({
            name: "Matrix/Zhang" + i,
            ageType: 0,
            birthday: "19800101",
            gender: "M",
            cardType: "PP",
            cardNum: "G756789" + i,
            cardExpired: "20250101",
            cardIssuePlace: "CN",
            nationality: "CN",
          });
        }
      } else if (this.searchCondition["otaPlatform"] === "tongcheng") {
        requestData["userName"] = this.searchCondition["otaUserName"];
        requestData["tripType"] = this.searchCondition.tripType;
        requestData["sessionId"] = "S12345";
        requestData["routing"] = routing;
        requestData["passengers"] = [];
        requestData["passengerAuxes"] = [];
        for (let i = 0; i < this.searchCondition.adultNum; i++) {
          requestData["passengers"].push({
            lastName: "Zhang",
            firstName: "Matrix" + i,
            ageType: 0,
            birthday: "19800101",
            gender: "M",
            cardType: "PP",
            cardNum: "G756789" + i,
            cardExpired: "20250101",
            cardIssuePlace: "CN",
            nationality: "CN",
          });
        }
      } else if (this.searchCondition["otaPlatform"] === "meituan") {
        requestData["tripType"] = this.searchCondition.tripType;
        requestData["reqId"] = 32323112233312;
        requestData["routing"] = routing;
        requestData["passengers"] = [];
        for (let i = 0; i < this.searchCondition.adultNum; i++) {
          requestData["passengers"].push({
            name: "Matrix/Zhang" + i,
            ageType: 0,
            birthday: "19800101",
            gender: "M",
            cardType: "PP",
            cardNum: "G756789" + i,
            cardExpired: "20250101",
            cardIssuePlace: "CN",
            nationality: "CN",
          });
        }
      }
      connector
        .gatewaySericeAxios()
        .post(
          "/codec/encrypt/" +
            this.searchCondition["otaPlatform"] +
            "/" +
            this.searchCondition["otaUserName"] +
            "?traceId=" +
            this.traceId,
          requestData
        )
        .then((resp) => {
          console.log("生单加密返回的报文:", resp);
          connector
            .otaInterfaceAxios()
            .post(
              "/ota_interface/order_create/" +
                this.searchCondition["otaPlatform"] +
                "/" +
                this.searchCondition["otaUserName"] +
                "?traceId=" +
                this.traceId,
              resp["data"]
            )
            .then((resp2) => {
              this.spendTime = new Date().getMilliseconds() - startTime;
              console.log("生单后返回的结果为:", resp2);
              connector
                .gatewaySericeAxios()
                .post(
                  "/codec/decrypt/" +
                    this.searchCondition["otaPlatform"] +
                    "/" +
                    this.searchCondition["otaUserName"] +
                    "?traceId=" +
                    this.traceId,
                  resp2
                )
                .then((resp3) => {
                  console.log("生单报文解密的结果为:", resp3);
                  this.responseMessage = JSON.stringify(
                    JSON.parse(resp3["data"]),
                    null,
                    2
                  );
                });
            });
        });
    },
    orderPay() {
      let startTime = new Date().getMilliseconds();
      this.interfaceName = "支付";
      this.spendTime = 0;
      let orderCreateResult = JSON.parse(this.responseMessage);
      let routing = {};
      routing["data"] = orderCreateResult["routing"]["data"];
      routing["fromSegments"] = orderCreateResult["routing"]["fromSegments"];
      routing["retSegments"] = orderCreateResult["routing"]["retSegments"];

      let requestData = {};
      requestData["cid"] = this.searchCondition["otaUserName"];
      requestData["tripType"] = this.searchCondition.tripType;
      requestData["sessionId"] = orderCreateResult["sessionId"];
      requestData["reqId"] = 32323112233312;
      requestData["orderNo"] = orderCreateResult["orderNo"];
      requestData["pnrCode"] = orderCreateResult["pnrCode"];
      requestData["routing"] = routing;

      connector
        .gatewaySericeAxios()
        .post(
          "/codec/encrypt/" +
            this.searchCondition["otaPlatform"] +
            "/" +
            this.searchCondition["otaUserName"] +
            "?traceId=" +
            this.traceId,
          requestData
        )
        .then((resp) => {
          console.log("支付加密返回的报文:", resp);
          connector
            .otaInterfaceAxios()
            .post(
              "/ota_interface/order_pay/" +
                this.searchCondition["otaPlatform"] +
                "/" +
                this.searchCondition["otaUserName"] +
                "?traceId=" +
                this.traceId,
              resp["data"]
            )
            .then((resp2) => {
              this.spendTime = new Date().getMilliseconds() - startTime;
              console.log("支付后返回的结果为:", resp2);
              connector
                .gatewaySericeAxios()
                .post(
                  "/codec/decrypt/" +
                    this.searchCondition["otaPlatform"] +
                    "/" +
                    this.searchCondition["otaUserName"] +
                    "?traceId=" +
                    this.traceId,
                  resp2
                )
                .then((resp3) => {
                  console.log("支付报文解密的结果为:", resp3);
                  this.responseMessage = JSON.stringify(
                    JSON.parse(resp3["data"]),
                    null,
                    2
                  );
                });
            });
        });
    },
  },
};
</script>
