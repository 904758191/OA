<template>
  <!-- 航班数据 -->
  <div>
    <a-divider orientation="left">
      航班数据
      <span style="font-size: 14px; color: red;"
        >（a.凡是通过批量录入导入的政策，都只会新增，不会更新原有政策；b.当存在多条政策时，系统默认取价格低的政策；）</span
      >
    </a-divider>
    <a-form>
      <!-- 第一行 -->
      <div class="row">
        <!-- <div class="form-group "> -->
            
              <button class="btn btn-info btn-fill col-md-1"><a-upload class="">
                选择文件</a-upload>
              </button>
            
        <!-- </div> -->
        <button class="col-md-1 btn btn-info btn-fill">上传</button>
        <button class="col-md-1 btn btn-info btn-fill" @click="download">
          下载样例
        </button>
        <button class="col-md-1 btn btn-info btn-fill">单程导入</button>
        <button class="col-md-1 btn btn-info btn-fill">往返录入</button>
        <button class="col-md-1 btn btn-info btn-fill">往返SP录入</button>
        <button class="col-md-1 btn btn-info btn-fill" @click="itemFix">
          新增
        </button>
      </div>
      <!-- 第二行 -->
      <div class="row">
        <div class="col-lg-1">
          <label>类型</label>
          <el-select placeholder="全部" v-model="tripType">
            <el-option value="0" label="单程"></el-option>
            <el-option value="1" label="往返"></el-option>
          </el-select>
        </div>
        <div class="col-lg-1">
          <label>航司</label>
          <input
            type="text"
            v-model="searchCondition['searchCarrier']"
            class="form-control"
            placeholder="TR"
          />
        </div>
        <div class="col-lg-1">
          <label>出发机场</label>
          <input
            type="text"
            v-model="searchCondition['depAirport']"
            class="form-control"
            placeholder="NGB"
          />
        </div>
        <div class="col-lg-1">
          <label>到达机场</label>
          <input
            type="text"
            v-model="searchCondition['arrAirport']"
            class="form-control"
            placeholder="NGB"
          />
        </div>
        <div class="col-lg-1">
          <label>航班号</label>
          <input
            type="text"
            v-model="searchCondition['fightNumber']"
            class="form-control"
            placeholder="UO112"
          />
        </div>
        <div class="col-lg-1">
          <label>票价:</label>
          <input type="text" class="form-control" />
        </div>
        <div class="col-lg-3">
          <label>去程日期:</label>
          <el-date-picker
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="date"
          ></el-date-picker>
        </div>
        <div class="col-lg-1">
          <label>上架下架</label>
          <el-select placeholder="上架">
            <el-option value="0">上架</el-option>
            <el-option value="1">下架</el-option>
          </el-select>
        </div>
        <div class="col-lg-1">
          <label>类型</label>
          <el-select placeholder="全部">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="0" label="手动"></el-option>
            <el-option value="1" label="自动"></el-option>
          </el-select>
        </div>
        <div class="col-lg-1 searchback">
          <p-checkbox>查往返</p-checkbox>
        </div>
      </div>
      <!-- 第三行 -->
      <div class="row">
        <!-- <div class="col-md-1">
          <label>票价:</label>
          <input type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label>去程日期:</label>
          <el-date-picker
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="date"
          ></el-date-picker>
        </div>
        <div class="col-md-1">
          <label>上架下架</label>
          <el-select placeholder="上架">
            <el-option value="0">上架</el-option>
            <el-option value="1">下架</el-option>
          </el-select>
        </div>
        <div class="col-md-1">
          <label>类型</label>
          <el-select placeholder="全部">
            <el-option value="-1" label="全部"></el-option>
            <el-option value="0" label="手动"></el-option>
            <el-option value="1" label="自动"></el-option>
          </el-select>
        </div> -->
        <button class="col-md-1 btn btn-info btn-fill" @click="search()">
          查询
        </button>
        <!-- <div class="col-md-1">
          <p-checkbox>查往返</p-checkbox>
        </div> -->
      </div>
    </a-form>

    <div>
      <!-- <el-table :data="dataList" border style="width:100%">
        <el-table-column
          v-for="column in tableColumns"
          :key="column.label"
          :prop="column.prop"
          :label="column.label"
        ></el-table-column>
        <el-table-column label="航线">
          <template slot-scope="scope"
            >{{ scope.row.depCity }}-{{ scope.row.arrCity }}</template
          >
        </el-table-column>
        <el-table-column label="航班信息">
          <el-table :data="dataMessage" border style="width:100%">
            <el-table-column
              v-for="column in littleTab"
              :key="column.label"
              :prop="column.prop"
              :label="column.label"
            >
            </el-table-column>
          </el-table>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openEdit(scope.row.id)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table> -->

      <!-- 表格渲染 -->
      <table class="table table-bordered display mb-0">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                v-model="selectAll"
                true-value="true"
                false-value="false"
                @click="selectAllClick"
              />
            </th>
            <th>ID</th>
            <th>类型</th>
            <th>航司</th>
            <th>去程日期</th>
            <th>返程日期</th>
            <th>运价类型</th>
            <th>状态</th>
            <th>航线</th>
            <!-- <th>航班信息</th> -->
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-for="(data, index) in dataList" :key="index">
          <tr>
            <td><input type="checkbox" /></td>
            <td>{{ data.id }}</td>
            <td>{{ data.tripType }}</td>
            <td>{{ data.searchCarrier }}</td>
            <td>{{ data.depDate }}</td>
            <td>{{ data.retDate }}</td>
            <td>{{ data.fareType }}</td>
            <td>{{ data.status }}</td>
            <td>{{ data.depCity }}{{ data.arrCity }}</td>
            <td>
              <el-button type="text" size="small" @click="openEdit(data.id)"
                >编辑</el-button
              >
            </td>
          </tr>
          <tr>
            <td colspan="21">
              <table class="table table-bordered display mb-0">
                <tbody
                  v-for="(fromSegment, index) in data.fromSegmentList"
                  :key="index"
                >
                  <tr>
                    <td>去程航班信息</td>
                    <td>{{ fromSegment["carrier"] }}</td>
                    <td>{{ fromSegment["arrTime"] }}</td>
                    <td>{{ fromSegment["depTime"] }}</td>
                    <td>{{ fromSegment["arrAirport"] }}</td>
                    <td>{{ fromSegment["depAirport"] }}</td>
                    <td>{{ fromSegment["flightNumber"] }}</td>
                    <td v-if="data.fareType == 0">
                      {{ fromSegment.publicCabins[0]["cabinName"] }}/
                      {{ fromSegment.publicCabins[0]["count"] }} /
                      {{ fromSegment.publicCabins[0]["adultPrice"] }} /
                      {{ fromSegment.publicCabins[0]["adultTax"] }}/
                      {{ fromSegment.publicCabins[0]["childTax"] }}/
                      {{ fromSegment.publicCabins[0]["childPrice"] }}/
                    </td>
                    <td
                      v-if="data.fareType == 1"
                      v-for="(priv, index) in fromSegment.privateCabins"
                      :key="index"
                    >
                      {{ priv["cabinName"] }}/ {{ priv["count"] }}/
                      {{ priv["adultPrice"] }}/ {{ priv["adultTax"] }}/
                      {{ priv["childTax"] }}/
                      {{ priv["childPrice"] }}
                    </td>
                  </tr>
                  <td colspan="7"></td>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colspan="21">
              <table class="table table-bordered display mb-0">
                <tbody
                  v-for="(retSegment, index) in data.retSegmentList"
                  :key="index"
                >
                  <tr>
                    <td>回程航班信息</td>
                    <td>{{ retSegment["carrier"] }}</td>
                    <td>{{ retSegment["arrTime"] }}</td>
                    <td>{{ retSegment["depTime"] }}</td>
                    <td>{{ retSegment["arrAirport"] }}</td>
                    <td>{{ retSegment["depAirport"] }}</td>
                    <td>{{ retSegment["flightNumber"] }}</td>
                    <td v-if="data.fareType == 0">
                      {{ retSegment.publicCabins[0]["cabinName"] }} /{{
                        retSegment.publicCabins[0]["count"]
                      }}/{{ retSegment.publicCabins[0]["adultPrice"] }} /{{
                        retSegment.publicCabins[0]["adultTax"]
                      }}/{{ retSegment.publicCabins[0]["childTax"] }}/{{
                        retSegment.publicCabins[0]["childPrice"]
                      }}
                    </td>
                    <td
                      v-if="data.fareType == 1"
                      v-for="(pub, index) in retSegment.publicCabins"
                      :key="index"
                    >
                      {{ pub["cabinName"] }}/{{ pub["count"] }}/{{
                        pub["adultPrice"]
                      }}/{{ pub["adultTax"] }}/{{ pub["childTaxchildTax"] }}/{{
                        pub["childPrice"]
                      }}
                    </td>
                  </tr>
                  <td colspan="7"></td>
                  <!-- <tr
                    col
                    v-for="(pub, index) in retSegment.publicCabins"
                    :key="index"
                  >
                    <td>公有运价</td>
                    <td>{{ pub["cabinName"] }}</td>
                    <td>{{ pub["count"] }}</td>
                    <td>{{ pub["adultPrice"] }}</td>
                    <td>{{ pub["adultTax"] }}</td>
                    <td>{{ pub["childTaxchildTax"] }}</td>
                    <td>{{ pub["childPrice"] }}</td>
                  </tr> -->
                  <!-- <tr
                    v-for="(priv, index) in retSegment.privateCabins"
                    :key="index"
                  >
                    <td>私有运价</td>
                    <td>{{ priv["cabinName"] }}</td>
                    <td>{{ priv["count"] }}</td>
                    <td>{{ priv["adultPrice"] }}</td>
                    <td>{{ priv["adultTax"] }}</td>
                    <td>{{ priv["childTax"] }}</td>
                    <td>{{ priv["childPrice"] }}</td>
                  </tr> -->
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
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
  },
  data() {
    return {


      // 公有的大标头
      dataList: [],
      // 回程航班公有信息
      fromSegmentList: [],
      // 公有运价
      publicCabins: [],
      // 私有运价
      privateCabins: [],
      selectAll: false,
      date: "",
      searchCondition: {},
      code: 999,
      tableColumns: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "tripType",
          label: "类型",
        },
        {
          prop: "searchCarrier",
          label: "航司",
        },
        {
          prop: "depDate",
          label: "去程日期",
        },
        {
          prop: "retDate",
          label: "返程日期",
        },
        {
          prop: "fareType",
          label: "运价类型",
        },
        {
          prop: "status",
          label: "状态",
        },
      ],
      littleTab: [
        {
          prop: "carrier",
          label: "航司",
        },
        {
          prop: "arrTime",
          label: "到达日期",
        },
        {
          prop: "depTime",
          label: "出发日期",
        },
        {
          prop: "arrAirport",
          label: "到达机场",
        },
      ],
    };
  },
  methods: {



    async search() {
      // this.dataList=[],
      let rep = await this.axios.post(
        "/privateFare/searchWithEntity",
        this.searchCondition
      );
      // alert(rep.data.list.formSegmentList[0].depTime);
      this.dataList = rep.data.list;
      // if (this.dataList.fareType == 0) {
      //   this.fromSegment.publicCabins =
      //     rep.data.list[0].fromSegmentList[0].publicCabins;
      // }
      // alert(res.data.list.fareType);
      // alert(rep.data.list[0].fromSegmentList[0].publicCabins);

      // alert(this.dataList);
      // this.fromSegmentList = rep.data.list.fromSegmentList;
      // this.publicCabins = rep.data.list.fromSegmentList.publicCabins;
      // this.privateCabins = rep.data.list.fromSegmentList.privateCabins;
    },
    download() {
      this.axios.get("/privateFare/downloadTemplate").then((res) => {});
    },
    itemFix(e) {
      let id = e.target.dataset.id;
      this.$router.push(`/forms/tankuang/hangbandata_new`);
    },
    openEdit(id) {
      // alert(id)
      this.$router.push({
        path: `/forms/tankuang/hangbandata_table_edit`,
        query: { id },
      });
    },
    selectAllClick() {
      this.dataList.forEach((d) => {
        d["checked"] = this.selectAll === "false";
      });
    },
  },
};
</script>
<style scoped>
button {
  margin: 0px 5px;
  font-family: cursive;
}
/* 查往返 */
.searchback{
  margin-top: 23px;
}
.row{
  margin-bottom: 12px;
}
label{
  font-family: cursive; color:#275c73;
}
tr{
  font-family: cursive;color:#275c73;
}
</style>
