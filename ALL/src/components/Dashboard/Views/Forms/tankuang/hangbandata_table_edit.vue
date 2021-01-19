<template>
  <!-- 修改日期格式 -->
  <div>
    <h4>
      {{
        tripType == 1
          ? "单程直飞"
          : tripType == 2
          ? "单程中转"
          : tripType == 3
          ? "往返直飞"
          : "往返中转"
      }}
    </h4>
    <div>
      <!-- 固定不变 -->
      <form>
        <div class="row">
          <div class="form-group col-md-1">
            <label>航线：</label>
            <div class="row">
              <input type="text" class="form-control" v-model="depCity" />
              <input type="text" class="form-control" v-model="arrCity" />
            </div>
          </div>

          <div class="form-group col-md-2">
            <el-item-form>
              <label>公私有：</label>
              <el-select v-model="fareType" placeholder="公有">
                <el-option
                  v-for="item in fareTypeop"
                  :value="item.value"
                  :label="item.name"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-item-form>
          </div>
          <div class="form-group col-md-2">
            <label>状态：</label>
            <el-select v-model="status" placeholder="上线">
              <el-option
                v-for="item in statusop"
                :value="item.value"
                :label="item.name"
                :key="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </form>
      <div class="row">
        <el-form :model="fromSegmentList">
          <div class="from-group col-md-2">
            <el-form-item>
              <label>航司</label>
              <input
                type="text"
                v-model="fromSegmentList[0].carrier"
                class=" form-control"
                placeholder="SQ"
              />
            </el-form-item>
          </div>
          <div class="from-group col-md-2">
            <el-form-item>
              <label>出发时间</label>
              <el-date-picker
                type="datetime"
                v-model="fromSegmentList[0].depTime"
                value-format="yyyyMMddHHmm"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="from-group col-md-2">
            <el-form-item>
              <label>到达时间</label>
              <el-date-picker
                type="datetime"
                v-model="fromSegmentList[0].arrTime"
                value-format="yyyyMMddHHmm"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="from-group col-md-2">
            <el-form-item>
              <label>出发机场</label>
              <input
                type="text"
                class=" form-control"
                v-model="fromSegmentList[0].depAirport"
                placeholder="SQ"
              />
            </el-form-item>
          </div>
          <div class="from-group col-md-1">
            <el-form-item>
              <label>到达机场</label>
              <input
                type="text"
                class=" form-control"
                v-model="fromSegmentList[0].arrAirport"
                placeholder="SQ"
              />
            </el-form-item>
          </div>
          <div class="from-group col-md-1">
            <el-form-item>
              <label>航班号</label>
              <input
                type="text"
                class=" form-control"
                v-model="fromSegmentList[0].flightNumber"
                placeholder="SQ"
              />
            </el-form-item>
          </div>
          <!-- <div v-if="tripType == 2 || tripType == 4">
            <button
              class="btn btn-small col-md-1"
              @click="deleteSelect(item, index)"
            >
              删除
            </button>
            <button class="btn btn-small col-md-1" @click="addSelect">
              增加
            </button>
          </div> -->
        </el-form>
      </div>

      <div class="row">
        <!-- <h4 style="color:red">：</h4> -->
        <el-form :model="publicCabins_go" v-if="publicCabins_go != null">
          <div class="row">
            <div class="col-md-2">
              <p class="font-size">公有运价</p>
            </div>
            <div class="form-group col-md-2">
              <label>舱位：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_go[0].cabinName"
              />
            </div>
            <div class="form-group col-md-2">
              <label>数量：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_go[0].count"
              />
            </div>
            <div class="form-group col-md-1">
              <label>成人价：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_go[0].adultPrice"
              />
            </div>
            <div class="form-group col-md-1">
              <label>成人税：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_go[0].adultTax"
              />
            </div>
            <div class="form-group col-md-2">
              <label>儿童价：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_go[0].childPrice"
              />
            </div>
            <div class="form-group col-md-2">
              <label>儿童税：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_go[0].childTax"
              />
            </div>
          </div>
        </el-form>
      </div>

      <el-form
        ref="fromSegmentList"
        :model="privateCabins"
        v-if="privateCabins != null"
      >
        <div class="row">
          <!-- <h4 style="color:red">：</h4> -->
          <!-- 动态加载表单 -->
          <div class="col-md-2">
            <p class="font-size">私有运价</p>
          </div>
          <el-form-item class="col-md-2">
            <label>舱位</label>
            <el-input v-model="privateCabins[0].cabinName"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>数量</label>
            <el-input v-model="privateCabins[0].count"></el-input>
          </el-form-item>
          <el-form-item class="col-md-1">
            <label>成人价</label>
            <el-input v-model="privateCabins[0].adultPrice"></el-input>
          </el-form-item>
          <el-form-item class="col-md-1">
            <label>成人税</label>
            <el-input v-model="privateCabins[0].adultTax"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>儿童价</label>
            <el-input v-model="privateCabins[0].childPrice"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>儿童税</label>
            <el-input v-model="privateCabins[0].childTax"></el-input>
          </el-form-item>

          <el-form-item>
            <div v-if="tripType == 1">
              <button
                class="btn btn-small col-md-1"
                @click="deleteItem(index, item)"
              >
                删除
              </button>
              <button
                class="btn btn-small col-md-1"
                @click.prevent="addItem"
                style="clear:right"
              >
                添加
              </button>
            </div>
          </el-form-item>
        </div>
        <div
          v-for="(item, index) in privateCabins"
          v-if="index >= 1 && tripType == 1"
          :key="index"
          class="row"
        >
          <el-form-item
            class="col-md-2"
            :prop="'params.' + index + 'paramName'"
          >
            <label>舱位</label>
            <el-input v-model="item.cabinName"></el-input>
          </el-form-item>
          <el-form-item
            class="col-md-2"
            :prop="'params.' + index + '.paramValue'"
          >
            <label>数量</label>
            <el-input v-model="item.count"></el-input> </el-form-item
          ><el-form-item>
            <el-form-item class="col-md-1">
              <label>成人价</label>
              <el-input v-model="item.adultPrice"></el-input>
            </el-form-item>
            <el-form-item class="col-md-1">
              <label>成人税</label>
              <el-input v-model="item.adultTax"></el-input>
            </el-form-item>
            <el-form-item class="col-md-2">
              <label>儿童价</label>
              <el-input v-model="item.childPrice"></el-input>
            </el-form-item>
            <el-form-item class="col-md-2">
              <label>儿童税</label>
              <el-input v-model="item.childTax"></el-input>
            </el-form-item>

            <button
              class="btn btn-small col-md-1"
              @click="deleteItem(item, index)"
            >
              删除
            </button>
            <button class="btn btn-small col-md-1" @click.prevent="addItem">
              添加
            </button>
          </el-form-item>
        </div>
      </el-form>
      <hr />
      <br />
      <hr />
      <!-- 渲染表单 -->
      <div v-if="tripType != 1">
        <!-- 增加的航司 -->
        <div
          v-for="(item, index) in fromSegmentList"
          v-if="index >= 1"
          :key="index"
          class="row"
        >
          <el-form-item class="col-md-2">
            <label>航司</label>
            <el-input v-model="item.carrier"></el-input>
          </el-form-item>

          <el-form-item class="col-md-2">
            <label>出发时间</label>
            <el-date-picker
              type="datetime"
              v-model="item.depTime"
              value-format="yyyyMMddHHmm"
            ></el-date-picker>
          </el-form-item>

          <el-form-item class="col-md-2">
            <label>到达时间</label>
            <el-date-picker
              type="datetime"
              v-model="item.arrTime"
              value-format="yyyyMMddHHmm"
            ></el-date-picker>
          </el-form-item>

          <el-form-item class="col-md-2">
            <label>出发机场</label>
            <input
              type="text"
              class=" form-control"
              v-model="item.depAirport"
              placeholder="SQ"
            />
          </el-form-item>
          <el-form-item class="col-md-1">
            <label>到达机场</label>
            <input
              type="text"
              class=" form-control"
              v-model="item.arrAirport"
              placeholder="SQ"
            />
          </el-form-item>
          <el-form-item>
            <div class="from-group col-md-2">
              <label>航班号</label>
              <input
                type="text"
                class=" form-control"
                v-model="item.flightNumber"
                placeholder="SQ"
              />
            </div>
          </el-form-item>

          <!-- 添加公有运价 -->
          <div class="col-md-2">
            <p class="font-size">公有运价</p>
          </div>
          <el-form-item class="col-md-2">
            <label>舱位</label>
            <el-input v-model="item.publicCabins[0].cabinName"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>数量</label>
            <el-input v-model="item.publicCabins[0].count"></el-input>
          </el-form-item>
          <el-form-item class="col-md-1">
            <label>成人价</label>
            <el-input v-model="item.publicCabins[0].adultPrice"></el-input>
          </el-form-item>
          <el-form-item class="col-md-1">
            <label>成人税</label>
            <el-input v-model="item.publicCabins[0].adultTax"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>儿童价</label>
            <el-input v-model="item.publicCabins[0].childPrice"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>儿童税</label>
            <el-input v-model="item.publicCabins[0].childTax"></el-input>
          </el-form-item>

          <!-- 添加私有运价 -->
          <div class="col-md-2">
            <p class="font-size">私有运价</p>
          </div>
          <el-form-item class="col-md-2">
            <label>舱位</label>
            <el-input v-model="item.privateCabins[0].cabinName"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>数量</label>
            <el-input v-model="item.privateCabins[0].count"></el-input>
          </el-form-item>
          <el-form-item class="col-md-1">
            <label>成人价</label>
            <el-input v-model="item.privateCabins[0].adultPrice"></el-input>
          </el-form-item>
          <el-form-item class="col-md-1">
            <label>成人税</label>
            <el-input v-model="item.privateCabins[0].adultTax"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>儿童价</label>
            <el-input v-model="item.privateCabins[0].childPrice"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>儿童税</label>
            <el-input v-model="item.privateCabins[0].childTax"></el-input>
          </el-form-item>

          <!-- <button
            class="btn btn-small col-md-1"
            @click="deleteSelect(item, index)"
          >
            删除
          </button>
          <button class="btn btn-small col-md-1" @click="addSelect">
            添加
          </button> -->
        </div>
      </div>
    </div>
    <!-- 返程 -->
    <hr />
    <br />
    <hr />
    <div v-if="tripType == 3 || tripType == 4">
      <!-- 航班信息 -->
      <h4>返程航班：</h4>
      <div class="row">
        <el-form :model="retSegmentList" v-if="retSegmentList != null">
          <div class="from-group col-md-2">
            <el-form-item>
              <label>航司</label>
              <input
                type="text"
                v-model="retSegmentList[0].carrier"
                class=" form-control"
                placeholder="SQ"
              />
            </el-form-item>
          </div>
          <div class="from-group col-md-2">
            <el-form-item>
              <label>出发时间</label>
              <el-date-picker
                type="datetime"
                v-model="retSegmentList[0].depTime"
                value-format="yyyyMMddHHmm"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="from-group col-md-2">
            <el-form-item>
              <label>到达时间</label>
              <el-date-picker
                type="datetime"
                v-model="retSegmentList[0].arrTime"
                value-format="yyyyMMddHHmm"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="from-group col-md-2">
            <el-form-item>
              <label>出发机场</label>
              <input
                type="text"
                class=" form-control"
                v-model="retSegmentList[0].depAirport"
                placeholder="SQ"
              />
            </el-form-item>
          </div>
          <div class="from-group col-md-1">
            <el-form-item>
              <label>到达机场</label>
              <input
                type="text"
                class=" form-control"
                v-model="retSegmentList[0].arrAirport"
                placeholder="SQ"
              />
            </el-form-item>
          </div>
          <div class="from-group col-md-1">
            <el-form-item>
              <label>航班号</label>
              <input
                type="text"
                class=" form-control"
                v-model="retSegmentList[0].flightNumber"
                placeholder="SQ"
              />
            </el-form-item>
          </div>
          <!-- <div v-if="tripType == 2 || tripType == 4">
            <button
              class="btn btn-small col-md-1"
              @click="deleteSelect_back(item, index)"
            >
              删除
            </button>
            <button class="btn btn-small col-md-1" @click="addSelect_back">
              增加
            </button>
          </div> -->
        </el-form>
      </div>

      <div class="row">
        <!-- <h4 style="color:red">：</h4> -->
        <el-form :model="publicCabins_back">
          <div class="row">
            <div class="col-md-2">
              <p class="font-size">公有运价</p>
            </div>
            <div class="form-group col-md-2">
              <label>舱位：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_back[0].cabinName"
              />
            </div>
            <div class="form-group col-md-2">
              <label>数量：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_back[0].count"
              />
            </div>
            <div class="form-group col-md-1">
              <label>成人价：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_back[0].adultPrice"
              />
            </div>
            <div class="form-group col-md-1">
              <label>成人税：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_back[0].adultTax"
              />
            </div>
            <div class="form-group col-md-2">
              <label>儿童价：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_back[0].childPrice"
              />
            </div>
            <div class="form-group col-md-2">
              <label>儿童税：</label>
              <input
                type="text"
                class="form-control"
                v-model="publicCabins_back[0].childTax"
              />
            </div>
          </div>
        </el-form>
        <!-- 渲染表单 -->
        <div v-if="tripType != 1">
          <!-- 增加的航司 -->
          <div
            v-for="(item, index) in retSegmentList"
            v-if="index >= 1"
            :key="index"
            class="row"
          >
            <el-form-item class="col-md-2">
              <label>航司</label>
              <el-input v-model="item.carrier"></el-input>
            </el-form-item>

            <el-form-item class="col-md-2">
              <label>出发时间</label>
              <el-date-picker
                type="datetime"
                v-model="item.depTime"
                value-format="yyyyMMddHHmm"
              ></el-date-picker>
            </el-form-item>

            <el-form-item class="col-md-2">
              <label>到达时间</label>
              <el-date-picker
                type="datetime"
                v-model="item.arrTime"
                value-format="yyyyMMddHHmm"
              ></el-date-picker>
            </el-form-item>

            <el-form-item class="col-md-2">
              <label>出发机场</label>
              <input
                type="text"
                class=" form-control"
                v-model="item.depAirport"
                placeholder="SQ"
              />
            </el-form-item>
            <el-form-item class="col-md-1">
              <label>到达机场</label>
              <input
                type="text"
                class=" form-control"
                v-model="item.arrAirport"
                placeholder="SQ"
              />
            </el-form-item>
            <el-form-item>
              <div class="from-group col-md-2">
                <label>航班号</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="item.flightNumber"
                  placeholder="SQ"
                />
              </div>
            </el-form-item>

            <!-- 添加公有运价 -->
            <div class="col-md-2">
              <p class="font-size">公有运价</p>
            </div>
            <el-form-item class="col-md-2">
              <label>舱位</label>
              <el-input v-model="item.publicCabins[0].cabinName"></el-input>
            </el-form-item>
            <el-form-item class="col-md-2">
              <label>数量</label>
              <el-input v-model="item.publicCabins[0].count"></el-input>
            </el-form-item>
            <el-form-item class="col-md-1">
              <label>成人价</label>
              <el-input v-model="item.publicCabins[0].adultPrice"></el-input>
            </el-form-item>
            <el-form-item class="col-md-1">
              <label>成人税</label>
              <el-input v-model="item.publicCabins[0].adultTax"></el-input>
            </el-form-item>
            <el-form-item class="col-md-2">
              <label>儿童价</label>
              <el-input v-model="item.publicCabins[0].childPrice"></el-input>
            </el-form-item>
            <el-form-item class="col-md-2">
              <label>儿童税</label>
              <el-input v-model="item.publicCabins[0].childTax"></el-input>
            </el-form-item>

            <!-- 添加私有运价 -->
            <div class="col-md-2">
              <p class="font-size">私有运价</p>
            </div>
            <el-form-item class="col-md-2">
              <label>舱位</label>
              <el-input v-model="item.privateCabins[0].cabinName"></el-input>
            </el-form-item>
            <el-form-item class="col-md-2">
              <label>数量</label>
              <el-input v-model="item.privateCabins[0].count"></el-input>
            </el-form-item>
            <el-form-item class="col-md-1">
              <label>成人价</label>
              <el-input v-model="item.privateCabins[0].adultPrice"></el-input>
            </el-form-item>
            <el-form-item class="col-md-1">
              <label>成人税</label>
              <el-input v-model="item.privateCabins[0].adultTax"></el-input>
            </el-form-item>
            <el-form-item class="col-md-2">
              <label>儿童价</label>
              <el-input v-model="item.privateCabins[0].childPrice"></el-input>
            </el-form-item>
            <el-form-item class="col-md-2">
              <label>儿童税</label>
              <el-input v-model="item.privateCabins[0].childTax"></el-input>
            </el-form-item>

            <button
              class="btn btn-small col-md-1"
              @click="deleteSelect_back(item, index)"
            >
              删除
            </button>
            <button class="btn btn-small col-md-1" @click.prevent="addSelect_back">
              添加
            </button>
          </div>
        </div>
      </div>

      <el-form ref="fromSegmentList" :model="privateCabins_back">
        <div class="row">
          <!-- <h4 style="color:red">：</h4> -->
          <!-- 动态加载表单 -->
          <div class="col-md-2">
            <p class="font-size">私有运价</p>
          </div>
          <el-form-item class="col-md-2">
            <label>舱位</label>
            <el-input v-model="privateCabins_back[0].cabinName"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>数量</label>
            <el-input v-model="privateCabins_back[0].count"></el-input>
          </el-form-item>
          <el-form-item class="col-md-1">
            <label>成人价</label>
            <el-input v-model="privateCabins_back[0].adultPrice"></el-input>
          </el-form-item>
          <el-form-item class="col-md-1">
            <label>成人税</label>
            <el-input v-model="privateCabins_back[0].adultTax"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>儿童价</label>
            <el-input v-model="privateCabins_back[0].childPrice"></el-input>
          </el-form-item>
          <el-form-item class="col-md-2">
            <label>儿童税</label>
            <el-input v-model="privateCabins_back[0].childTax"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <button class="btn btn-info" @click="update">保存</button>
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
import PProgress from "@/components/UIComponents/Progress.vue";
import PSwitch from "@/components/UIComponents/Switch.vue";
import PPagination from "@/components/UIComponents/Pagination.vue";
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
      id: 0,
      depCity: "",
      arrCity: "",
      tripType: "",
      // tripTypeop: [
      //   {
      //     name: "单程直飞",
      //     value: 1,
      //   },
      //   {
      //     name: "单程中转",
      //     value: 2,
      //   },
      //   {
      //     name: "往返直飞",
      //     value: 3,
      //   },
      //   {
      //     name: "往返中转",
      //     value: 4,
      //   },
      // ],
      fareType: "",
      fareTypeop: [
        {
          name: "公有",
          value: 0,
        },
        {
          name: "私有",
          value: 1,
        },
      ],
      status: "",
      statusop: [
        {
          name: "上线",
          value: 0,
        },
        {
          name: "下线",
          value: 1,
        },
      ],
      // 渲染单程表单时的数据结构
      fromSegmentList: [
        {
          carrier: "",
          arrTime: "",
          depTime: "",
          depAirport: "",
          arrAirport: "",
          flightNumber: "",
          publicCabins: [
            {
              count: "",
              cabinName: "",
              adultPrice: "",
              adultTax: "",
              childPrice: "",
              childTax: "",
            },
          ],
          privateCabins: [
            {
              count: "",
              cabinName: "",
              adultPrice: "",
              adultTax: "",
              childTax: "",
              childPrice: "",
            },
          ],
        },
      ],
      // 渲染往返表单时的数据结构
      retSegmentList: [
        {
          carrier: "",
          arrTime: "",
          depTime: "",
          depAirport: "",
          arrAirport: "",
          flightNumber: "",
          publicCabins: [
            {
              count: "",
              cabinName: "",
              adultTax: "",
              childTax: "",
              adultPrice: "",
              childPrice: "",
            },
          ],
          privateCabins: [
            {
              count: "",
              cabinName: "",
              adultTax: "",
              childTax: "",
              adultPrice: "",
              childPrice: "",
            },
          ],
        },
      ],

      publicCabins_go: [
        {
          count: "",
          cabinName: "",
          adultPrice: "",
          adultTax: "",
          childPrice: "",
          childTax: "",
        },
      ],
      publicCabins_back: [
        {
          count: "",
          cabinName: "",
          adultTax: "",
          childTax: "",
          adultPrice: "",
          childPrice: "",
        },
      ],
      privateCabins: [
        {
          count: "",
          cabinName: "",
          adultTax: "",
          childTax: "",
          adultPrice: "",
          childPrice: "",
        },
      ],
      privateCabins_back: [
        {
          count: "",
          cabinName: "",
          adultTax: "",
          childTax: "",
          adultPrice: "",
          childPrice: "",
        },
      ],
      routingData: {
        id: 0,
        depCity: "",
        arrCity: "",
        tripType: "",
        fareType: "",
        status: "",
        fromSegmentList: [
          {
            carrier: "",
            arrTime: "",
            depTime: "",
            depAirport: "",
            arrAirport: "",
            flightNumber: "",
            publicCabins: [],
            privateCabins: [],
          },
        ],
        retSegmentList: [
          {
            carrier: "",
            arrTime: "",
            depTime: "",
            depAirport: "",
            arrAirport: "",
            flightNumber: "",
            publicCabins: [],
            privateCabins: [],
          },
        ],
      },
    };
  },

  mounted() {
    let id = this.$route.query.id;
    if (id) {
      this.axios.get("/privateFare/selectRoutingById/" + id).then((res) => {
        this.id = res.data.id;
        // 单程
        this.depCity = res.data.depCity;
        this.arrCity = res.data.arrCity;
        this.tripType = res.data.tripType;
        this.fareType = res.data.fareType;
        this.status = res.data.status;
        this.fromSegmentList = res.data.fromSegmentList;
        //
        this.publicCabins_go = res.data.fromSegmentList[0].publicCabins;

        this.privateCabins = res.data.fromSegmentList[0].privateCabins;

        // 往返
        this.retSegmentList = res.data.retSegmentList;
        // alert(res.data.retSegmentList[0].privateCabins);
        // if (res.data.retSegmentList == "") {
        //   this.privateCabins_back = null;
        //   this.publicCabins_back = null;
        // } else {
        //   this.privateCabins_back = res.data.retSegmentList[0].privateCabins;
        //   this.publicCabins_back = res.data.retSegmentList[0].publicCabins;
        // }

        this.privateCabins_back = res.data.retSegmentList[0].privateCabins;
        this.publicCabins_back = res.data.retSegmentList[0].publicCabins;
      });
    }
  },
  methods: {
    // 添加单程直飞表单
    addItem() {
      this.privateCabins.push({
        count: "",
        cabinName: "",
        adultTax: "",
        childTax: "",
        adultPrice: "",
        childPrice: "",
      });
    }, // 删除单程直飞表单
    deleteItem(item, index) {
      this.privateCabins.splice(index, 1);
    },

    //   // 表单保存
    async update() {
      //把routingData 的id赋值 = this.$route.query.id
      this.routingData.id = this.id;
      this.routingData.depCity = this.depCity;
      this.routingData.arrCity = this.arrCity;
      this.routingData.tripType = this.tripType;

      this.routingData.fareType = this.fareType;
      this.routingData.status = this.status;
      this.routingData.fromSegmentList = this.fromSegmentList;
      this.tripType == 1
        ? (this.routingData.retSegmentList = this.retSegmentList)
        : (this.routingData.retSegmentList = []);
      // this.routingData.fromSegmentList[0].depAirport = this.fromSegmentList[0].depAirport;
      // alert(JSON.stringify(this.routingData.fromSegmentList))

      this.routingData.fromSegmentList[0].publicCabins = this.publicCabins_go;
      this.routingData.fromSegmentList[0].privateCabins = this.privateCabins;
      if (this.tripType == 3 || this.tripType == 4) {
        this.routingData.retSegmentList = this.retSegmentList;
        this.routingData.retSegmentList[0].publicCabins = this.publicCabins_back;
        this.routingData.retSegmentList[0].privateCabins = this.privateCabins_back;
      } else {
        this.routingData.retSegmentList = [];
      }
      console.log(JSON.stringify(this.routingData));
      let rep = await this.axios.post(
        "/privateFare/updateRouting",
        this.routingData
      );
      if (rep.code == 0) {
        alert(rep.message);
      }
    },
  },
};
</script>

<style scope>
.btn,
.navbar .navbar-nav > li > a.btn {
  margin: 20px 0;
}
.show {
  display: none !important;
}
.font-size{
  color: black;
  font-size: 30px;
}
</style>
