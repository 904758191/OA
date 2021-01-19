<template>
  <div>
    <!--  -->
    <el-tabs type="border-card">
      <el-tab-pane label="行李设置">
        <h4>行李设置</h4>
        <div>
          
            <div class="row">
              <div class="form-group col-md-2">
                <label class="control-label">航司</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="searchCondition['carrier']"
                />
              </div>
              <div class="form-group col-md-2">
                <label class="control-label">出发机场</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="searchCondition['depAirport']"
                />
              </div>
              <div class="form-group col-md-2">
                <label class="control-label">到达机场</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="searchCondition['arrAirport']"
                />
              </div>
            </div>
            <div class="row">
              <button
                class="btn btn-info btn-fill col-md-1"
                @click="search1(1)"
              >
                搜索
              </button>
              <button class="btn btn-info btn-fill col-md-1" @click="reset1">
                清空
              </button>
              <button
                class="btn btn-info btn-fill col-md-1"
                v-on:click="openCreateDialog1"
              >
                新建
              </button>
              <button
                class="btn btn-info btn-fill col-md-1"
                @click="exportData"
              >
                导出数据
              </button>
              <div class="form-group col-md-3">
                <!-- <label class="control-label">批量录入</label> -->
                <input
                  type="file"
                  class="form-control"
                  @change="uploadFileSelect($event)"
                />
              </div>
              <button
                class="btn btn-info btn-fill col-md-1"
                @click="uploadFile"
              >
                上传数据
              </button>
              <button
                class="btn btn-info btn-fill col-md-1"
                @click="downloadTemplate"
              >
                下载模板
              </button>
            </div>
          
          <el-table :data="dataList1">
            <el-table-column
              v-for="column in tableColumns1"
              :key="column.lable"
              :prop="column.prop"
              :label="column.label"
            >
            </el-table-column>
            <el-table-column> </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="验价黑名单">
        <h4>验价黑名单</h4>
        <div>
          <form action="#">
            <div>
              <div class="form-group col-md-2">
                <label class="control-label">航司</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="searchCondition['carrier']"
                />
              </div>
              <div class="form-group col-md-1">
                <label class="control-label">平台</label>

                <el-select @change="platformChange(searchCondition)">
                  <el-option label="ALL">ALL</el-option>
                  <el-option
                    v-for="(item, key) in otaPlatformList"
                    :value="item['name']"
                    :key="key"
                    :label="item['showName']"
                  ></el-option>
                </el-select>
              </div>
              <div class="form-group col-md-1">
                <label class="control-label">马甲</label>

                <el-select v-model="searchCondition['otaUserName']">
                  <el-option label="ALL">ALL</el-option>
                  <el-option
                    v-for="(item, key) in otaUserList"
                    :value="item['userName']"
                    :key="key"
                    :label="item['userShowName']"
                  ></el-option>
                </el-select>
              </div>
              <button class="btn btn-info btn-fill" @click="search2(1)">
                搜索
              </button>
              <button class="btn btn-info btn-fill" @click="reset2">
                清空
              </button>
              <button
                class="btn btn-info btn-fill"
                v-on:click="openCreateDialog2"
              >
                新建
              </button>
            </div>
          </form>
          <el-table :data="dataList2">
            <el-table-column
              v-for="column in tableColumns2"
              :key="column.lable"
              :prop="column.prop"
              :label="column.label"
            >
            </el-table-column>
            <el-table-column label="平台">
              <template slot-scope="scope">
                {{ scope.row.otaConfig }}{{ scope.row.showName }}
              </template>
            </el-table-column>
            <el-table-column label="马甲">
              <template slot-scope="scope">
                {{ scope.row.otaConfig }}{{ scope.row.userShowName }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="禁售黑名单">
        <h4>禁售黑名单</h4>
        <div>
          <!-- <form action="#"> -->
            <div>
              <div class="form-group col-md-2">
                <label class="control-label">航司</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="searchCondition['carrier']"
                />
              </div>
              <div class="form-group col-md-2">
                <label class="control-label">平台</label>

                <el-select
                  v-model="searchCondition['otaPlatform']"
                  @change="platformChange(searchCondition)"
                >
                  <el-option label="ALL">ALL</el-option>
                  <el-option
                    v-for="(item, key) in otaPlatformList"
                    :value="item['name']"
                    :key="key"
                    :label="item['showName']"
                  ></el-option>
                </el-select>
              </div>
              <div class="form-group col-md-2">
                <label class="control-label">马甲</label>

                <el-select v-model="searchCondition['otaUserName']">
                  <el-option label="ALL">ALL</el-option>
                  <el-option
                    v-for="(item, key) in otaUserList"
                    :value="item['userName']"
                    :key="key"
                    :label="item['userShowName']"
                  ></el-option>
                </el-select>
              </div>
              <button class="btn btn-info btn-fill" @click="search3(1)">
                搜索
              </button>
              <button class="btn btn-info btn-fill" @click="reset3">
                清空
              </button>
              <button
                class="btn btn-info btn-fill"
                v-on:click="openCreateDialog3"
              >
                新建
              </button>
            </div>
          <el-table :data="dataList3">
            <el-table-column
              v-for="column in tableColumns3"
              :key="column.lable"
              :prop="column.prop"
              :label="column.label"
            >
            </el-table-column>
            <el-table-column label="平台">
              <template slot-scope="scope">
                {{ scope.row.otaConfig }}{{ scope.row.showName }}
              </template>
            </el-table-column>
            <el-table-column label="马甲">
              <template slot-scope="scope">
                {{ scope.row.otaConfig }}{{ scope.row.userShowName }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="行李配置4">行李配置4</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 外部引入
import validator from "src/service/validator";
// import connector from "@/service/connector";
import ErrorModal from "src/components out/ErrorModal";
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
    ErrorModal,
  },
  data() {
    return {
      // 行李配置
      searchCondition: {},
      data: {},
      operateType: "",
      otaPlatformList: [],
      otaUserList: [],
      page: {
        pageSize: 20,
        resultCount: 0,
        totalPage: 1,
        firstPage: 1,
        lastPage: 1,
        previousPage: 1,
        nextPage: 1,
        currentPage: 1,
        goPage: 1,
      },
      dataList1: [],
      tableColumns1: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "carrier",
          label: "航司",
        },
        {
          prop: "depAirport",
          label: "出发机场",
        },
        {
          prop: "arrAirport",
          label: "到达机场",
        },
        {
          prop: "showName",
          label: "平台",
        },
        {
          prop: "userShowName",
          label: "马甲",
        },
        {
          prop: "piece",
          label: "数量",
        },
        {
          prop: "weight",
          label: "重量",
        },
      ],
      // 验价黑名单
      searchCondition: {
        otaPlatform: "ALL",
        otaUserName: "ALL",
        carrier: "",
      },
      otaConfigList: [],
      otaPlatformList: [],
      // 用户选择了平台之后,计算相应的马甲数据
      otaUserList: [],
      dataList2: [],
      tableColumns2: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "carrier",
          label: "航司",
        },
        {
          prop: "airLine",
          label: "航线",
        },
      ],
      // 禁售黑名单
      dataList3: [],
      tableColumns3: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "carrier",
          label: "航司",
        },
        {
          prop: "scope",
          label: "范围",
        },
        {
          prop: "content",
          label: "内容",
        },
        {
          prop: "ruleType",
          label: "类型",
        },
        {
          prop: "ruleContent",
          label: "规则",
        },
      ],
    };
  },

  // mounted() {
    // 行李设置
    // let requestData = { page: { pageSize: 100, currentPage: 1 } };
    // this.axios.post("/ota_config/list.do",requestData).then((resp)=>{
    //     this.otaConfigList = resp["data"]["list"];
    //     this.otaConfigList.forEach((otaConfig) => {
    //       let add = true;
    //       for (let index in this.otaPlatformList) {
    //         if (this.otaPlatformList[index]["name"] === otaConfig["name"]) {
    //           add = false;
    //           break;
    //         }
    //       }
    //       if (add) {
    //         this.otaPlatformList.splice(
    //           this.otaPlatformList.length,
    //           0,
    //           otaConfig
    //         );
    //       }
    //     });

    // })
    // connector
    //   .gatewaySericeAxios()
    //   .post("/ota_config/list.do", requestData)
    //   .then((resp) => {
    //     this.otaConfigList = resp["data"]["list"];
    //     console.log(this.otaConfigList);
    //     this.otaConfigList.forEach((otaConfig) => {
    //       let add = true;
    //       for (let index in this.otaPlatformList) {
    //         if (this.otaPlatformList[index]["name"] === otaConfig["name"]) {
    //           add = false;
    //           break;
    //         }
    //       }
    //       if (add) {
    //         this.otaPlatformList.splice(
    //           this.otaPlatformList.length,
    //           0,
    //           otaConfig
    //         );
    //       }
    //     });
    //   });
  // },
  methods: {
    // 行李设置
    // search1(){
    //   alert(111111)
    // },
     search1(currentPage) {
      this.dataList1 = [];
      let requestData = this.searchCondition;
      requestData["pageParam"] = {
        pageNum: currentPage,
        pageSize: this.page["pageSize"],
      };
      // connector
      //   .priceSericeAxios()
      //   .post("/config/baggage/search", requestData)
      //   .then((resp) => {
      //     this.dataList = resp["data"]["list"];
      //     this.dataList.forEach((d) => {
      //       if (d.otaPlatform && d.otaPlatform !== "ALL") {
      //         d["showName"] = this.otaConfigList.filter(
      //           (o) => o.name == d.otaPlatform
      //         )[0].showName;
      //       } else if (d.otaPlatform == "ALL") {
      //         d["showName"] = "ALL";
      //       }
      //       if (d.otaUserName && d.otaUserName != "ALL") {
      //         d["userShowName"] = this.otaConfigList.filter(
      //           (o) => o.userName == d.otaUserName
      //         )[0].userShowName;
      //       } else if (d.otaUserName == "ALL") {
      //         d["userShowName"] = "ALL";
      //       }
      //     });
      //     this.page["currentPage"] = currentPage;
      //     this.page["goPage"] = currentPage;
      //     connector.extractPriceAdminPage(this.page, resp);
      //   });

      // requestData.otaPlatform = "";
      // requestData.otaUserName = "";
      // alert(JSON.stringify(requestData));
      this.axios.post("/config/baggage/search", requestData).then((res) => {
        this.dataList1 = res.data.list;
        this.dataList1.forEach((d)=>{
          if (d.otaPlatform && d.otaPlatform !== "ALL") {
              d["showName"] = this.otaConfigList.filter(
                (o) => o.name == d.otaPlatform
              )[0].showName;
            } else if (d.otaPlatform == "ALL") {
              d["showName"] = "ALL";
            }
            if (d.otaUserName && d.otaUserName != "ALL") {
              d["userShowName"] = this.otaConfigList.filter(
                (o) => o.userName == d.otaUserName
              )[0].userShowName;
            } else if (d.otaUserName == "ALL") {
              d["userShowName"] = "ALL";
            }
        })
        this.page["currentPage"] = currentPage;
          this.page["goPage"] = currentPage;
      });
    },
    downloadTemplate() {
      connector
        .priceSericeAxios()
        .get("/config/baggage/downloadTemplate", { responseType: "blob" })
        .then((resp) => {
          let url = window.URL.createObjectURL(
            new Blob([resp], {
              type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "baggage.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    uploadFileSelect(event) {
      this.file = event.target.files[0];
    },
    uploadFile() {
      console.log(this.file);
      let formData = new FormData();
      formData.append("file", this.file);
      connector
        .priceSericeAxios()
        .post("/config/baggage/uploadFile", formData)
        .then((resp) => {
          console.log("报文上传返回的结果为:", resp);
          if (resp.code === 0) this.$msgSuccess(resp.message);
          else this.$msgError(resp.message);
        });
    },
    // 导出数据
    exportData() {
      connector
        .priceSericeAxios()
        .post("/config/baggage/exportFile", this.searchCondition, {
          responseType: "blob",
        })
        .then((resp) => {
          console.log("导出文件返回的数据为:", resp);
          let url = window.URL.createObjectURL(
            new Blob([resp], {
              type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "baggage_export.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    // 清空
    reset1() {
      this.searchCondition = {};
    },
    // 平台
    // 三个平台相同
    platformChange(data) {
      console.log("OtaPlatform", data["otaPlatform"]);
      this.otaUserList = [];
      data["otaUserName"] = "ALL";
      if (data["otaPlatform"] !== "ALL") {
        this.otaConfigList.forEach((otaConfig) => {
          if (otaConfig["name"] === data["otaPlatform"]) {
            this.otaUserList.splice(this.otaUserList.length, 0, otaConfig);
          }
        });
      }
    },
    // 新建
    openCreateDialog1() {
      this.operateType = "create";
      this.data = { piece: 1, weight: 20 };
      // eslint-disable-next-line no-undef
      showEditDialog();
    },
    // 修改
    openEditDialog(data) {
      this.operateType = "edit";
      this.data = data;
      // eslint-disable-next-line no-undef
      showEditDialog();
    },
    // 保存
    save1() {
      if (this.operateType === "create") {
        this.create();
      } else {
        this.update();
      }
    },
    // 封装的方法
    create() {
      this.checkData();
      connector
        .priceSericeAxios()
        .post("/config/baggage/add", this.data)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    update() {
      this.checkData();
      connector
        .priceSericeAxios()
        .post("/config/baggage/update", this.data)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    checkData() {
      validator.twoLetterNumberCheck(this.data["carrier"], true, "航司代码");
      validator.threeLetterCheck(this.data["depAirport"], true, "出发机场");
      validator.threeLetterCheck(this.data["arrAirport"], true, "到达机场");
      validator.numberCheck(this.data["piece"], 1, 5, true, "数量");
      validator.numberCheck(this.data["weight"], 1, 50, true, "重量");
      validator.valueNullCheck(this.data["otaPlatform"], true, "平台名称");
      validator.valueNullCheck(this.data["otaUserName"], true, "马甲");
    },
    // 删除
    deleteBlack1(data) {
      connector
        .priceSericeAxios()
        .post("/config/baggage/delete", data)
        .then(() => {
          this.search(this.page["currentPage"]);
        });
    },

    // 验价黑名单
    search2(currentPage) {
      this.dataList2 = [];
      this.page["currentPage"] = currentPage;
      let requestData = {
        searchCondition: this.searchCondition,
        page: this.page,
      };
      // connector
      //   .gatewaySericeAxios()
      //   .post("/price_verify_black/list.do", requestData)
      //   .then((resp) => {
      //     this.dataList = resp["data"]["list"];
      //     this.page = resp["data"]["page"];
      //     this.page["goPage"] = currentPage;
      //   });
      this.axios
        .post("/price_verify_black/list.do", requestData)
        .then((res) => {
          this.dataList2 = res.data.list;
        });
    },
    reset2() {
      this.searchCondition = {
        otaPlatform: "ALL",
        otaUserName: "ALL",
        carrier: "",
      };
    },
    openCreateDialog2() {
      this.data = { otaPlatform: "ALL", otaUserName: "ALL" };
      // eslint-disable-next-line no-undef
      showEditDialog();
    },

    save2() {
      this.create2();
    },
    create2() {
      validator.valueNullCheck(this.data["carrier"], true, "航司代码");
      connector
        .gatewaySericeAxios()
        .post("/price_verify_black/create.do", this.data)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    deleteBlack2(data) {
      connector
        .gatewaySericeAxios()
        .post("/price_verify_black/delete.do", data)
        .then(() => {
          this.search(this.page["currentPage"]);
        });
    },
    // 黑名单
    search3(currentPage) {
      this.dataList3 = [];
      this.page["currentPage"] = currentPage;
      let requestData = {
        searchCondition: this.searchCondition,
        page: this.page,
      };
      connector
        .gatewaySericeAxios()
        .post("/black/list.do", requestData)
        .then((resp) => {
          this.dataList = resp["data"]["list"];
          this.page = resp["data"]["page"];
          this.page["goPage"] = currentPage;
        });
      this.axios.post("/config/black/search", requestData).then((res) => {
        this.dataList3 = res.data.list;
      });
    },
    reset3() {
      this.searchCondition = {
        otaPlatform: "ALL",
        otaUserName: "ALL",
        carrier: "",
      };
    },
    copyBlack(data) {
      this.dataTemplate = JSON.parse(JSON.stringify(data));
      delete this.dataTemplate["id"];
    },
    openCreateDialog3() {
      this.data = JSON.parse(JSON.stringify(this.dataTemplate));
      // eslint-disable-next-line no-undef
      showEditDialog();
    },

    save3() {
      this.create3();
    },
    create3() {
      validator.valueNullCheck(this.data["carrier"], true, "航司代码");
      connector
        .gatewaySericeAxios()
        .post("/black/create.do", this.data)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    deleteBlack3(data) {
      connector
        .gatewaySericeAxios()
        .post("/black/delete.do", data)
        .then(() => {
          this.search(this.page["currentPage"]);
        });
    },
  },
};
</script>

<style scoped>
  .row{
    margin-bottom: 12px;
  }
  .btn, .navbar .navbar-nav > li > a.btn{
    margin: 25px 0;
  }
</style>>
