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
              <input
                type="text"
                class="form-control"
                placeholder="HKG"
                v-model="depCity"
              />
              <input
                type="text"
                class="form-control"
                placeholder="NGB"
                v-model="arrCity"
              />
            </div>
          </div>
          <div class="form-group col-md-2">
            <el-item-form>
              <label>类型：</label>
              <el-select
                v-model="tripType"
                @change="getTrip($event)"
                placeholder="单程直飞"
              >
                <el-option value="1" label="单程直飞"></el-option>
                <el-option value="2" label="单程中转"></el-option>
                <el-option value="3" label="往返直飞"></el-option>
                <el-option value="4" label="往返中转"></el-option>
              </el-select>
            </el-item-form>
          </div>
          <div class="form-group col-md-2">
            <el-item-form>
              <label>公私有：</label>
              <el-select v-model="fareType" placeholder="公有">
                <el-option value="0" label="公有"></el-option>
                <el-option value="1" label="私有"></el-option>
              </el-select>
            </el-item-form>
          </div>
          <div class="form-group col-md-2">
            <label>状态：</label>
            <el-select v-model="status" placeholder="上线">
              <el-option value="0" label="上线"></el-option>
              <el-option value="1" label="下线"></el-option>
            </el-select>
          </div>
        </div>
      </form>
      <div class="row">
        <el-form :model="fromSegmentList">
          <div class="form-group col-md-2">
            <el-form-item>
              <label>航司</label>
              <input
                type="text"
                v-model="fromSegmentList[0].carrier"
                class="form-control"
                placeholder="SQ"
              />
            </el-form-item>
          </div>
          <div class="form-group col-md-2">
            <el-form-item>
              <label>出发时间</label>
              <el-date-picker
                type="datetime"
                v-model="fromSegmentList[0].depTime"
                value-format="yyyyMMddHHmm"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="from-group col-md-2">
            <el-form-item>
              <label>到达时间</label>
              <el-date-picker
                type="datetime"
                v-model="fromSegmentList[0].arrTime"
                value-format="yyyyMMddHHmm"
              >
              </el-date-picker>
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
          <div v-if="tripType == 2 || tripType == 4">
            <button
              class="btn btn-small col-md-1"
              @click="deleteSelect(item, index)"
            >
              删除
            </button>
            <button class="btn btn-small col-md-1" @click.prevent="addSelect">
              增加
            </button>
          </div>
        </el-form>
      </div>

      <div class="row">
        <!-- <h4 style="color:red">：</h4> -->
        <el-form :model="publicCabins_go">
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

      <el-form :model="privateCabins">
        <div class="row">
          <!-- <h4 style="color:red">：</h4> -->
          <!-- 动态加载表单 -->
          <div class="col-md-2">
            <p class="font-size">私有运价</p>
          </div>
          <div class="col-md-2">
            <el-form-item>
              <label>舱位</label>
              <el-input v-model="privateCabins[0].cabinName"></el-input>
            </el-form-item>
          </div>
          <div class="col-md-2">
            <el-form-item>
              <label>数量</label>
              <el-input v-model="privateCabins[0].count"></el-input>
            </el-form-item>
          </div>
          <div class="col-md-1">
            <el-form-item>
              <label>成人价</label>
              <el-input v-model="privateCabins[0].adultPrice"></el-input>
            </el-form-item>
          </div>
          <div class="col-md-1">
            <el-form-item>
              <label>成人税</label>
              <el-input v-model="privateCabins[0].adultTax"></el-input>
            </el-form-item>
          </div>
          <div class="col-md-2">
            <el-form-item>
              <label>儿童价</label>
              <el-input v-model="privateCabins[0].childPrice"></el-input>
            </el-form-item>
          </div>

          <div class="col-md-2">
            <el-form-item>
              <label>儿童税</label>
              <el-input v-model="privateCabins[0].childTax"></el-input>
            </el-form-item>
          </div>

          <div v-if="tripType == 1">
            <button class="btn btn-small col-md-1">删除</button>
            <button
              class="btn btn-small col-md-1"
              @click.prevent="addItem"
              style="clear:right"
            >
              添加
            </button>
          </div>
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
            <el-input v-model="item.count"></el-input>
          </el-form-item>
          <el-form-item>
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
          <el-form :model="fromSegmentList">
            <div class="col-md-2">
              <el-form-item>
                <label>航司</label>
                <el-input v-model="item.carrier"></el-input>
              </el-form-item>
            </div>
            <div class="col-md-2">
              <el-form-item>
                <label>出发时间</label>
                <el-date-picker
                  type="datetime"
                  v-model="item.depTime"
                  value-format="yyyyMMddHHmm"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="col-md-2">
              <el-form-item>
                <label>到达时间</label>
                <el-date-picker
                  type="datetime"
                  v-model="item.arrTime"
                  value-format="yyyyMMddHHmm"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="col-md-2">
              <el-form-item>
                <label>出发机场</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="item.depAirport"
                  placeholder="SQ"
                />
              </el-form-item>
            </div>
            <div class="col-md-1">
              <el-form-item>
                <label>到达机场</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="item.arrAirport"
                  placeholder="SQ"
                />
              </el-form-item>
            </div>
            <div class="from-group col-md-2">
              <el-form-item>
                <label>航班号</label>
                <input
                  type="text"
                  class=" form-control"
                  v-model="item.flightNumber"
                  placeholder="SQ"
                />
              </el-form-item>
            </div>
            <!-- 添加公有运价 -->
            <div class="col-md-2">
              <p lass="font-size">公有运价</p>
            </div>
            <div class="col-md-2">
              <el-form-item>
                <label>舱位</label>
                <el-input v-model="item.publicCabins[0].cabinName"></el-input>
              </el-form-item>
            </div>
            <div class="col-md-2">
              <el-form-item>
                <label>数量</label>
                <el-input v-model="item.publicCabins[0].count"></el-input>
              </el-form-item>
            </div>

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
              @click="deleteSelect(item, index)"
            >
              删除
            </button>
            <button class="btn btn-small col-md-1" @click.prevent="addSelect">
              添加
            </button>
          </el-form>
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
        <el-form :model="retSegmentList">
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
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="from-group col-md-2">
            <el-form-item>
              <label>到达时间</label>
              <el-date-picker
                type="datetime"
                v-model="retSegmentList[0].arrTime"
                value-format="yyyyMMddHHmm"
              >
              </el-date-picker>
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
          <div v-if="tripType == 2 || tripType == 4">
            <button
              class="btn btn-small col-md-1"
              @click="deleteSelect_back(item, index)"
            >
              删除
            </button>
            <button class="btn btn-small col-md-1" @click.prevent="addSelect_back">
              增加
            </button>
          </div>
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
      <!-- 渲染表单 -->
      <div v-if="tripType != 1">
        <!-- 增加的航司 -->
        <div
          v-for="(item, index) in retSegmentList"
          v-if="index >= 1"
          :key="index"
          class="row"
        >
          <el-form :model="retSegmentList">
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
          </el-form>
        </div>
      </div>
    </div>

    <button class="btn btn-info" @click="submit">提交</button>
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
      tripType_x: "",
      depCity: "",
      arrCity: "",
      tripType: "",
      fareType: "",
      status: "",
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
    // 页面初始时私有运价为空
    // this.retSegmentList = null;
    // this.privateCabins_back = null;
    // this.publicCabins_back = null;
    let id = this.$route.query.id;
    if (id) {
      this.axios.get("/privateFare/selectRoutingById/" + id).then((res) => {
        // 出发机场
        this.depCity = res.data.depCity;
        // 到达机场
        this.fromSegmentList[0].arrAirport =
          res.data.fromSegmentList[0].arrAirport;
        // 航司
        this.fromSegmentList[0].carrier = res.data.fromSegmentList[0].carrier;
        // 航班号
        this.fromSegmentList[0].flightNumber =
          res.data.fromSegmentList[0].flightNumber;
      });
    }
  },
  methods: {
    // 添加单程直飞表单
    addItem() {
      this.privateCabins.push([
        {
          count: "",
          cabinName: "",
          adultTax: "",
          childTax: "",
          adultPrice: "",
          childPrice: "",
        },
      ]);
    }, // 删除单程直飞表单
    deleteItem(item, index) {
      this.privateCabins.splice(index, 1);
    },

    // 添加单程中转的航班
    addSelect() {
      this.fromSegmentList.push({
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
            childPrice: "",
            childTax: "",
          },
        ],
      });
    },
    // 删除单程中转表单
    deleteSelect(item, index) {
      this.fromSegmentList.splice(index, 1);
      // this.publicCabins_go.splice(index, 1);
      // this.privateCabins.splice(index, 1);
    },
    // 添加往返的表单
    addSelect_back() {
      this.retSegmentList.push({
        carrier: "",
        arrTime: "",
        depTime: "",
        depAirport: "",
        arrAirport: "",
        flightNumber: "",
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
      });
    },
    // 删除返程的表单
    deleteSelect_back(item, index) {
      this.retSegmentList.splice(index, 1);
    },
    // 监听select事件
    getTrip(event) {
      this.fromSegmentList = [
        {
          carrier: "",
          arrTime: "",
          depTime: "",
          depAirport: "",
          arrAirport: "",
          flightNumber: "",
        },
      ];
    },
    // 表单提交
    async submit() {
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
        "/privateFare/addRouting",
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

.font-size {
  color: black;
  font-size: 30px;
}
</style>
