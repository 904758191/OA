<template>
  <!-- removeCabin（）
    addCabin（）
 -->
  <div>
    <!-- 数据更新规则 -->
    <!-- 第一行 -->
    <div class="row">
      <div class="col-md-1">
        <label>航司</label>
        <input
          type="text"
          class="form-control"
          placeholder="TR"
          v-model="searchCondition['carrier']"
        />
      </div>
      <div class="col-md-1">
        <label>出发机场</label>
        <input
          type="text"
          class="form-control"
          placeholder="NGB"
          v-model="searchCondition['depAirport']"
        />
      </div>
      <div class="col-md-1">
        <label>到达机场</label>
        <input
          type="text"
          class="form-control"
          placeholder="NGB"
          v-model="searchCondition['arrAirport']"
        />
      </div>
      <div class="col-md-1">
        <label>行程类型</label>
        <el-select placeholder="全部" v-model="searchCondition['tripType']">
          <el-option value="0" label="全部"></el-option>
          <el-option
            v-for="(item, key) in $store.state.constant.tripType"
            :value="item.value"
            :key="key"
            :label="item.name"
          ></el-option>
        </el-select>
      </div>
      <div class="col-md-1">
        <label>渠道:</label>
        <el-select v-model="searchCondition['channel']">
          <el-option
            v-for="(item, key) in $store.state.constant.dataChannel"
            :value="item.value"
            :key="key"
            :label="item.name"
          ></el-option>
        </el-select>
      </div>
    </div>
    <!-- 第二行 -->
    <div class="row">
      <button class="btn btn-info btn-fill" @click="search(1)">搜索</button>
      <button class="btn btn-info btn-fill" @click="reset">清空</button>
      <button class="btn btn-info btn-fill" v-on:click="openCreateDialog">
        新建
      </button>
      <button class="btn btn-info btn-fill" @click="exportData">
        导出数据
      </button>
      <!-- <button class="btn btn-info btn-fill">选择文件</button> -->
      <div class="col-md-4">
        <input
        type="file"
        class="form-control"
        @change="uploadFileSelect($event)"
      />
      </div>
      
      <button class="btn btn-info btn-fill" @click="uploadFile">
        上传数据
      </button>
      <button class="btn btn-info btn-fill" @click="downloadTemplate">
        下载模板
      </button>
      <button class="btn btn-info btn-fill" @click="batchDelete">
        批量删除
      </button>
    </div>
    <!-- 渲染表格 -->
    <div>
      <el-table :data="dataList" border style="width:100%">
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          v-for="column in tableColumns"
          :key="column.label"
          :prop="column.prop"
          :label="column.label"
        ></el-table-column>
        <el-table-column label="行程类型">
          <template slot-scope="scope">
            <span v-if="scope.row.tripType==1">单程</span>
            <span v-else>双程</span>
          </template>
        </el-table-column>
        <el-table-column prop="channel" label="渠道"></el-table-column>
        <el-table-column label="Action" fixed="right" width="130px">
          <template>
            <el-button type="text" size="small" @click="copyRefreshRule(data)">复制</el-button>
            <el-button type="text" size="small" @click="openEditDialog(data)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteRule(data)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="col-sm-6">
      <p-pagination class="pull-right" v-model="page.currentPage">

      </p-pagination>
    </div>
  </div>
</template>
<script>
// 外部引入
import validator from "@/service/validator";
import connector from "@/service/connector";
import ErrorModal from "@/components out/ErrorModal";
import _ from "underscore";
// import axios from "axios";

// // 2 设置相关参数：基本路径、超时时间 等
// axios.defaults.baseURL = "http://192.168.31.183:8082";
// axios.defaults.timeout = 3000;
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
  name: "BaggageSearch",
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
    // 外部组件
    ErrorModal,
  },
  data() {
    return {
      searchCondition: {
        carrier: "",
        depAirport: "",
        arrAirport: "",
        tripType: 0,
        channel: "",
      },
      selectAll: "false",
      dataList: [],
      spiderCountRules: [],
      pointRules: [],
      rangeRules: [],
      cabins: [],
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
      data: {},
      tableColumns: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "carrier",
          label: "航司",
        },
        {
          prop: "depCity",
          label: "出发城市",
        },
        {
          prop: "arrCity",
          label: "到达城市",
        },
        {
          prop: "depAirport",
          label: "出发机场",
        },
        {
          prop: "arrAirport",
          label: "到达机场",
        },
      ],
      operateType: "",
    };
  },
  methods: {
    async search(currentPage) {
      this.dataList = [];
      let requestData = this.searchCondition;
      requestData["pageParam"] = {
        pageNum: currentPage,
        pageSize: this.page["pageSize"],
      };
      // connector
      //   .priceSericeAxios()
      //   .post("/refreshRule/get", requestData)
      //   .then((resp) => {
      //     this.dataList = resp["data"]["list"];
      //     this.page["currentPage"] = currentPage;
      //     this.page["goPage"] = currentPage;
      //     connector.extractPriceAdminPage(this.page, resp);
      //   });
      let { data } = await this.axios.post("/refreshRule/get", requestData);
      console.log(data.list);
      // this.data=data;
      this.dataList = data.list;
    },
    selectAllClick() {
      console.log("SelectAll:%s %s", typeof this.selectAll, this.selectAll);
      this.dataList.forEach((d) => {
        d["checked"] = this.selectAll === "false";
      });
    },
    getSelectedDataIds() {
      let ids = [];
      this.dataList.forEach((d) => {
        if (d["checked"]) {
          ids.push(d["id"]);
        }
      });
      return ids;
    },
    // 未找到
    batchDelete() {
      if (this.getSelectedDataIds().length === 0) {
        return;
      }
      let requestData = this.getSelectedDataIds();
      connector
        .priceSericeAxios()
        .post("/refreshRule/delBatch", requestData)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    reset() {
      this.searchCondition = {};
    },
    addSpiderCountRule() {
      this.spiderCountRules.push({ spiderCount: "", outCount: "" });
    },
    removeSpider(k) {
      this.spiderCountRules = _.filter(
        this.spiderCountRules,
        (v, i) => i !== k
      );
    },
    add(obj) {
      obj.push({ startDay: "", endDay: "", interval: "" });
    },
    removePointRules(k) {
      this.pointRules = _.filter(this.pointRules, (v, i) => i !== k);
    },
    addRangeRules() {
      this.rangeRules.push({
        startDay: "",
        endDay: "",
        interval: "",
        effectiveDay: "",
      });
    },
    removeRangeRules(k) {
      this.rangeRules = _.filter(this.rangeRules, (v, i) => i !== k);
    },
    // 未找到
    addCabin() {
      this.cabins.push({ priceMin: "", priceMax: "", cabin: "" });
    },
    // 未找到
    removeCabin(k) {
      this.cabins = _.filter(this.cabins, (v, i) => i !== k);
    },
    // 按钮新建
    openCreateDialog() {
      this.operateType = "create";
      // eslint-disable-next-line no-undef
      showEditDialog();
    },
    // 按钮复制
    copyRefreshRule(data) {
      this.operateType = "create";
      this.data = JSON.parse(JSON.stringify(data));
      this.pointRules = this.data.pointRules;
      this.pointRules.forEach((x) => {
        x.interval = x.interval / 60;
      });
      this.rangeRules = this.data.rangeRules;
      this.rangeRules.forEach((x) => {
        x.interval = x.interval / 60;
      });
      this.spiderCountRules = this.data.spiderCountRules
        ? this.data.spiderCountRules
        : [];
      this.cabins = this.data.cabins ? this.data.cabins : [];
      // eslint-disable-next-line no-undef
      showEditDialog();
    },
    // 按钮编辑
    openEditDialog(data) {
      this.operateType = "edit";
      this.data = JSON.parse(JSON.stringify(data));
      console.log(this.data);
      if (this.data.pointRules) {
        this.pointRules = this.data.pointRules;
        this.pointRules.forEach((x) => {
          x.interval = x.interval / 60;
        });
      }
      if (this.data.rangeRules) {
        this.rangeRules = this.data.rangeRules;
        this.rangeRules.forEach((x) => {
          x.interval = x.interval / 60;
        });
      }
      this.spiderCountRules = this.data.spiderCountRules
        ? this.data.spiderCountRules
        : [];
      this.cabins = this.data.cabins ? this.data.cabins : [];
      // eslint-disable-next-line no-undef
      showEditDialog();
    },
    // 按钮下载模板
    downloadTemplate() {
      connector
        .priceSericeAxios()
        .get("/refreshRule/downloadTemplate", { responseType: "blob" })
        .then((resp) => {
          //console.log('模板下载返回的数据为:', resp);
          let url = window.URL.createObjectURL(
            new Blob([resp], {
              type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "template.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    // 选择文件
    uploadFileSelect(event) {
      this.file = event.target.files[0];
    },
    // 按钮上传数据
    uploadFile() {
      console.log(this.file);
      let formData = new FormData();
      formData.append("file", this.file);
      connector
        .priceSericeAxios()
        .post("/refreshRule/uploadFile", formData)
        .then((resp) => {
          console.log("报文上传返回的结果为:", resp);
          if (resp.code === 0) this.$msgSuccess(resp.message);
          else this.$msgError(resp.message);
        });
    },
    // 按钮导出数据
    exportData() {
      connector
        .priceSericeAxios()
        .post("/refreshRule/exportFile", this.searchCondition, {
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
          link.setAttribute("download", "refresh_rule.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    // 按钮保存
    save() {
      if (this.pointRules.length > 0) {
        let startArray = this.pointRules
          .map((x) => x.startDay)
          .sort((a, b) => a - b);
        let endArray = this.pointRules
          .map((x) => x.endDay)
          .sort((a, b) => a - b);
        for (let i = 1; i < startArray.length; i++) {
          if (startArray[i] <= endArray[i - 1]) {
            this.$msgError("规则1时间点出现交叉");
            return;
          }
        }
      }
      if (this.rangeRules.length > 0) {
        let tmp = this.rangeRules.sort((x, y) =>
          x.startDay < y.startDay ? -1 : 1
        );
        let startDates = tmp.map((x) => x.startDay);
        let endDates = tmp.map((x) => x.endDay);
        for (let i = 1; i < startDates.length; i++) {
          if (startDates[i] <= endDates[i - 1]) {
            this.$msgError("规则2时间点出现交叉");
            return;
          }
        }
      }
      if (this.cabins.length > 0) {
        let startArray = this.cabins
          .map((x) => x.priceMin)
          .sort((a, b) => a - b);
        let endArray = this.cabins.map((x) => x.priceMax).sort((a, b) => a - b);
        for (let i = 1; i < startArray.length; i++) {
          if (startArray[i] <= endArray[i - 1]) {
            this.$msgError("舱位配置价格出现交叉");
            return;
          }
        }
        this.cabins.forEach((c) => (c.cabin = c.cabin.toUpperCase()));
        let cabinSet = new Set(this.cabins.map((x) => x.cabin));
        if (cabinSet.size !== this.cabins.length) {
          this.$msgError("存在重复的舱位");
          return;
        }
      }
      if (this.data.depCity === "ALL" && this.data.arrCity === "ALL") {
        if (this.pointRules.length === 0 && this.rangeRules.length === 0) {
          this.$msgError("请新增至少一个规则");
          return;
        }
      }
      this.data.pointRules = this.pointRules.map((x) => {
        x.interval = x.interval * 60;
        return x;
      });
      this.data.rangeRules = this.rangeRules.map((x) => {
        x.interval = x.interval * 60;
        return x;
      });
      this.data.spiderCountRules = this.spiderCountRules;
      console.log(this.data);
      if (this.operateType === "create") {
        this.create();
      } else {
        this.update();
      }
    },
    // 封装函数
    create() {
      this.checkData();
      connector
        .priceSericeAxios()
        .post("/refreshRule/add", this.data)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    // 封装函数
    update() {
      this.checkData();
      connector
        .priceSericeAxios()
        .post("/refreshRule/update", this.data)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    // 封装函数
    checkData() {
      validator.twoLetterNumberCheck(this.data["carrier"], true, "航司代码");
      validator.threeLetterCheck(this.data["depCity"], true, "出发城市");
      validator.threeLetterCheck(this.data["arrCity"], true, "到达城市");
      // validator.threeLetterCheck(this.data['depAirport'], true, '出发机场');
      // validator.threeLetterCheck(this.data['arrAirport'], true, '到达机场');
      // validator.numberCheck(this.data['piece'], 1, 5, true, '数量');
    },
    // 按钮删除
    deleteRule(data) {
      connector
        .priceSericeAxios()
        .get("/refreshRule/del/" + data.id)
        .then(() => {
          this.search(this.page["currentPage"]);
        });
    },
  },
};
</script>
