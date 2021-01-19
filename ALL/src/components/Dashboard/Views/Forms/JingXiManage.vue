<template>
  <!-- save()方法暂时还没调用
    saveBatchData()
    transitChange()
    cabinMatchClick()
    返程日期 X
 -->
  <div>
    <!-- 精细化调价 -->
    <a-form>
      <!-- 第一行 -->
      <div class="row">
        <div class="col-md-2 form-group">
          <label>平台:</label>
          <el-select v-model="searchCondition['platform']">
            <el-option
              v-for="(item, key) in otaConfigList"
              :value="item['userName'] + item['name']"
              :key="key"
              :label="item['showName'] + item['userShowName']"
            ></el-option>
          </el-select>
        </div>
        <div class="col-md-1">
          <label>行程类型</label>
          <el-select placeholder="全部" v-model="searchCondition.tripType">
            <el-option value="0" label="全部"></el-option>
            <el-option
              v-for="(item, key) in $store.state.constant.priceAdjustTripType"
              :value="item.value"
              :key="key"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="col-md-1">
          <label>类别</label>
          <el-select placeholder="全部" v-model="searchCondition.kind">
            <el-option value="0" label="全部"></el-option>
            <el-option
              v-for="(item, key) in $store.state.constant.priceAdjustKind"
              :value="item.value"
              :key="key"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="col-md-1">
          <label>类型</label>
          <el-select placeholder="全部" v-model="searchCondition.type">
            <el-option value="0" label="全部"></el-option>
            <el-option
              v-for="(item, key) in $store.state.constant.priceAdjustType"
              :value="item.value"
              :key="key"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="col-md-1">
          <label>上架下架</label>
          <el-select placeholder="上架" v-model="searchCondition.state">
            <el-option value="">全部</el-option>
            <el-option
              v-for="(item, key) in $store.state.constant.priceAdjustState"
              :value="item.value"
              :key="key"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="col-md-1">
          <label>票价:</label>
          <input
            type="text"
            class="form-control"
            v-model="searchCondition['price']"
          />
        </div>
        <div class="col-md-1">
          <label>航司</label>
          <input
            type="text"
            class="form-control"
            placeholder="TR"
            v-model="searchCondition['fromCarrier']"
          />~<input
            type="text"
            v-if="
              searchCondition.tripType ===
                $store.state.constant.priceAdjustTripType.rw.value
            "
            v-model="searchCondition['retCarrier']"
            class="form-control"
          />
        </div>

        <div class="col-md-1">
          <label>航班号</label>
          <input
            type="text"
            class="form-control"
            placeholder="UO112"
            v-model="searchCondition['fromFlightNumber']"
          />~<input
            type="text"
            v-if="
              searchCondition.tripType ===
                $store.state.constant.priceAdjustTripType.rw.value
            "
            v-model="searchCondition['retFlightNumber']"
            class="form-control"
          />
        </div>
        <div class="col-md-1">
          <label>舱位:</label>
          <input
            type="text"
            class="form-control"
            placeholder="X"
            v-model="searchCondition['fromCabin']"
          />~<input
            type="text"
            v-if="
              searchCondition.tripType ===
                $store.state.constant.priceAdjustTripType.rw.value
            "
            v-model="searchCondition['retCabin']"
            class="form-control"
          />
        </div>
      </div>
      <!-- 第二行 -->
      <div class="row">
        <div class="col-md-2">
          <label>出发机场</label>
          <div class="row">
            <input
              v-model="searchCondition['depAirPort']"
              type="text"
              class="form-control col-md-6"
              placeholder="NGB"
            />
          </div>
        </div>
        <div class="col-md-2">
          <label>到达机场</label>
          <div class="row">
            <input
              v-model="searchCondition['arrAirPort']"
              type="text"
              class="form-control col-md-6"
              placeholder="NGB"
            />
          </div>
        </div>
        <div class="col-md-4">
          <label>去程日期:</label>
          <el-date-picker
            v-model="searchCondition['fromTravelStart']"
            placeholder="startdate"
          ></el-date-picker
          >~<el-date-picker
            v-model="searchCondition['fromTravelEnd']"
          ></el-date-picker>
        </div>
        <div class="col-md-1">
          <p-checkbox
            v-model="searchCondition['routeReturn']"
            true-value="true"
            false-vule="false"
            >查往返</p-checkbox
          >
        </div>
        <div class="col-md-2">
          批量录入
          <div>
            <input type="file" @change="uploadFileSelect($event)" />
            <!-- <a-upload>
              <button class="btn btn-info btn-fill">
                
              </button>
            </a-upload> -->
          </div>
        </div>
        <button class="col-md-1 btn btn-info btn-fill" @click="uploadFile">
          上传数据
        </button>
      </div>
      <!-- 第三行   -->
      <div class="row">
        <button class="col-md-1 btn btn-info btn-fill" @click="search(1)">
          搜索
        </button>
        <button class="col-md-1 btn btn-info btn-fill" @click="reset">
          清空
        </button>
        <button
          class="col-md-1 btn btn-info btn-fill"
          v-on:click="openCreateDialog"
        >
          新建
        </button>
        <button class="col-md-1 btn btn-info btn-fill" @click="batchOnline">
          批量上架
        </button>
        <button class="col-md-1 btn btn-info btn-fill" @click="batchOffline">
          批量下架
        </button>
        <button class="col-md-1 btn btn-info btn-fill" @click="batchDelete">
          批量删除
        </button>
        <button
          class="col-md-1 btn btn-info btn-fill"
          @click="openBatchEditDialog"
        >
          批量修改
        </button>
        <button class="col-md-1 btn btn-info btn-fill" @click="exportData">
          导出数据
        </button>
        <button
          class="col-md-1 btn btn-info btn-fill"
          @click="downloadTemplate"
        >
          下载模板
        </button>
      </div>
    </a-form>
    <div class="row">
      <!-- Bordered Table -->
      <div class="col-sm-12">
        <div class="panel panel-default card-view pt-5 mb-0">
          <div class="panel-wrapper collapse in">
            <div class="panel-body pa-5 ma-0">
              <div class="table-wrap">
                <div class="table-responsive dataTables_wrapper">
                  <!-- <table
                      class="table table-hover table-bordered display mb-0"
                    >
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
                          <th>Id</th>
                          <th>航司</th>
                          <th>航线</th>
                          <th>行类</th>
                          <th>类型</th>
                          <th>航班号</th>
                          <th>舱位</th>
                          <th>上下架</th>
                          <th>类别</th>
                          <th>旅行日期</th>
                          <th>销售日期</th>
                          <th>范围</th>
                          <th>出票</th>
                          <th>成点</th>
                          <th>成钱</th>
                          <th>成税</th>
                          <th>儿点</th>
                          <th>儿钱</th>
                          <th>儿税</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(data, index) in dataList" :key="index">
                          <td>
                            <input v-model="data['checked']" type="checkbox" />
                          </td>
                          <td>{{ data["id"] }}</td>
                          <td>{{ data["fromCarrier"] }}</td>
                          <td>
                            {{ data["depAirPort"] }}-{{ data["arrAirPort"] }}
                          </td>
                          <td>
                            {{ priceAdjustTripTypeName(data["tripType"]) }}
                          </td>
                          <td>{{ priceAdjustTypeName(data["type"]) }}</td>
                          <td>{{ data["fromFlightNumber"] }}</td>
                          <td>{{ data["fromCabin"] }}</td>
                          <td>
                            <select
                              class="form-control"
                              @change="stateChange(data)"
                              v-model="data['state']"
                            >
                              <option
                                v-for="(item, key) in $store.state.constant
                                  .priceAdjustState"
                                :value="item.value"
                                :key="key"
                              >
                                {{ item.name }}
                              </option>
                            </select>
                          </td>
                          <td>{{ priceAdjustKindName(data["kind"]) }}</td>
                          <td>
                            {{ data["fromTravelStart"] }}-{{
                              data["fromTravelEnd"]
                            }}
                          </td>
                          <td>{{ data["sellStart"] }}-{{ data["sellEnd"] }}</td>
                          <td>{{ data["priceMin"] }}-{{ data["priceMax"] }}</td>
                          <td>{{ data["ticketTime"] }}H</td>
                          <td>{{ data["adultPricePercent"] }}%</td>
                          <td>{{ data["adultPriceAdd"] }}</td>
                          <td>{{ data["adultTaxAdd"] }}</td>
                          <td>{{ data["childPricePercent"] }}%</td>
                          <td>{{ data["childPriceAdd"] }}</td>
                          <td>{{ data["childTaxAdd"] }}</td>
                          <td>
                            <button
                              class="btn btn-warning btn-outline btn-xs btn-icon left-icon pl-5 pr-5 mg-0"
                              @click="copyPriceAdjust(data)"
                            >
                              <i class="fa fa-copy"></i><span>复制</span>
                            </button>
                            <button
                              class="btn btn-warning btn-outline btn-xs btn-icon left-icon pl-5 pr-5 mg-0"
                              @click="openEditDialog(data)"
                            >
                              <i class="fa fa-copy"></i><span>编辑</span>
                            </button>
                            <button
                              class="btn btn-warning btn-outline btn-xs btn-icon left-icon pl-5 pr-5 mg-0 ml-5"
                              @click="deletePriceAdjust(data)"
                            >
                              <i class="fa fa-times"></i><span>删除</span>
                            </button>
                            <button
                              class="btn btn-warning btn-outline btn-xs btn-icon left-icon pl-5 pr-5 mg-0 ml-5"
                              @click="itemLog(data)"
                            >
                              <i class="fa fa-file-text"></i><span>日志</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table> -->
                  <el-table
                    class="table-striped"
                    :data="dataList"
                    height="600"
                    border
                    style="100%"
                  >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="depAirPort" label="航线">
                      <template slot-scope="scope"
                        >{{ scope.row.depAirPort }}-{{
                          scope.row.arrAirPort
                        }}</template
                      >
                    </el-table-column>
                    <el-table-column
                      v-for="column in tableColumns"
                      :key="column.label"
                      :prop="column.prop"
                      :label="column.label"
                    ></el-table-column>

                    <el-table-column label="上下架">
                      <template slot-scope="scope">
                        <select
                          class="form-control"
                          @change="stateChange(data)"
                          v-model="data['state']"
                        >
                          <option
                            v-for="(item, key) in $store.state.constant
                              .priceAdjustState"
                            :value="item.value"
                            :key="key"
                            :label="item.name"
                          ></option>
                        </select>
                      </template>
                    </el-table-column>
                    <el-table-column label="旅行日期" prop="fromTravelStart">
                      <template slot-scope="scope">
                        {{ scope.row.fromTravelStart }}-{{
                          scope.row.fromTravelEnd
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column label="销售日期" prop="sellStart">
                      <template slot-scope="scope">
                        {{ scope.row.sellStart }}-{{ scope.row.sellEnd }}
                      </template>
                    </el-table-column>
                    <el-table-column label="范围" prop="priceMin">
                      <template slot-scope="scope">
                        {{ scope.row.priceMin }}-{{ scope.row.priceMax }}
                      </template>
                    </el-table-column>
                    <el-table-column label="行类">
                      <template slot-scope="scope">
                        <span v-if="scope.row.tripType == 1">单程</span>
                        <span v-else-if="scope.row.tripType == 2">往返</span>
                        <span v-else>往返SP</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="类型">
                      <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">私有</span>
                        <span v-else>公有</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="130px">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="small"
                          @click="openEditDialog(data)"
                          >编辑</el-button
                        >
                        <el-button
                          type="text"
                          size="small"
                          @click="deletePriceAdjust(data)"
                          >删除</el-button
                        >
                        <el-button
                          type="text"
                          size="small"
                          @click="itemLog(data)"
                          >日志</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="margin-top:5px">
                    <div class="dataTables_info txt-dark" style="float:left">
                      数据{{ this.page.resultCount }}条, 每页{{
                        this.page.pageSize
                      }}条, 共{{ this.page.totalPage }}页, 当前第{{
                        this.page.currentPage
                      }}页
                    </div>
                    <div
                      class="dataTables_paginate paging_simple_numbers has-warning form-inline"
                      style="float:right"
                    >
                      <button
                        type="button"
                        @click="search(page.firstPage)"
                        class="btn btn-warning btn-outline btn-xs btn-icon left-icon pd-0 mg-0"
                      >
                        <i class="fa fa-angle-double-left"></i><span>首页</span>
                      </button>
                      <button
                        type="button"
                        @click="search(page.previousPage)"
                        class="btn btn-warning btn-outline btn-xs btn-icon left-icon pd-0 mg-0"
                      >
                        <i class="fa fa-angle-left"></i><span>上一页</span>
                      </button>
                      <input
                        class="form-control ng-untouched ng-pristine ng-valid"
                        style="width: 60px;height:28px;line-height:1.5;padding:2px 5px;"
                        type="text"
                        v-model="page['goPage']"
                      />
                      <button
                        type="button"
                        @click="search(page['goPage'])"
                        class="btn btn-warning btn-outline btn-xs btn-icon left-icon pd-0 mg-0"
                      >
                        <i class="fa fa-arrow-circle-right"></i><span>Go</span>
                      </button>
                      <button
                        type="button"
                        @click="search(page.nextPage)"
                        class="btn btn-warning btn-outline btn-xs btn-icon left-icon pd-0 mg-0"
                      >
                        <i class="fa fa-angle-right"></i><span>下一页</span>
                      </button>
                      <button
                        type="button"
                        @click="search(page.lastPage)"
                        class="btn btn-warning btn-outline btn-xs btn-icon left-icon pd-0 mg-0"
                      >
                        <i class="fa fa-angle-double-right"></i
                        ><span>末页</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Bordered Table -->
    </div>
    <div
      class="modal fade"
      id="editor-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="editor-title"
    >
      <div class="modal-dialog" style="margin-top: 80px" role="document">
        <form id="editor" class="modal-content form-horizontal" action="#">
          <div class="modal-header">
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
            <h6 class="modal-title">新建调价数据</h6>
          </div>
          <div class="modal-body pt-5 pb-0 pl-5 pr-5">
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*平台选择</label>
                  <div class="col-sm-8">
                    <select class="form-control" v-model="data['platform']">
                      <option
                        v-for="(item, key) in otaConfigList"
                        :value="item['userName'] + item['name']"
                        :key="key"
                      >
                        {{ item["showName"] }}{{ item["userShowName"] }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*行程类型</label>
                  <div class="col-sm-8">
                    <select
                      class="form-control"
                      v-model="data['tripType']"
                      @change="check"
                    >
                      <option
                        v-for="(item, key) in $store.state.constant
                          .priceAdjustTripType"
                        :value="item.value"
                        :key="key"
                      >
                        {{ item.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*调价类型</label>
                  <div class="col-sm-8">
                    <select class="form-control" v-model="data['type']">
                      <option
                        v-for="(item, key) in $store.state.constant
                          .priceAdjustType"
                        :value="item.value"
                        :key="key"
                      >
                        {{ item.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">返程间隔</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['retStart']"
                      type="number"
                      class="form-control"
                      style="width: 120px; display: inline"
                    />-<input
                      style="width:120px;display: inline"
                      v-model="data['retEnd']"
                      type="number"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*去程航司</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['fromCarrier']"
                      type="text"
                      class="form-control"
                      placeholder="填写单个航司二字码, 只能填写一个航司，如UO"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*返程航司</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['retCarrier']"
                      type="text"
                      class="form-control"
                      placeholder="填写单个航司二字码, 只能填写一个航司，如UO"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*去程航线</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['depAirPort']"
                      type="text"
                      class="form-control"
                      style="width: 120px; display: inline"
                      placeholder="三位机场编码"
                    />~<input
                      style="width:120px;display: inline"
                      v-model="data['arrAirPort']"
                      type="text"
                      class="form-control"
                      placeholder="三位机场编码"
                    />
                    {{ data["tripType"] }}
                    {{ $store.state.constant.priceAdjustTripType.rw.value }}
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*返程航线</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['depAirPortRet']"
                      type="text"
                      class="form-control"
                      style="width: 120px; display: inline"
                      placeholder="三位机场编码"
                    />~<input
                      style="width:120px;display: inline"
                      v-model="data['arrAirPortRet']"
                      type="text"
                      class="form-control"
                      placeholder="三位机场编码"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*去程航班号</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['fromFlightNumber']"
                      type="text"
                      class="form-control"
                      placeholder="单个航班号或ALL"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*返程航班号</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['retFlightNumber']"
                      type="text"
                      class="form-control"
                      placeholder="单个航班号或ALL"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*去程舱位</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['fromCabin']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*返程舱位</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['retCabin']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label"
                    >*去程平台展示舱位</label
                  >
                  <div class="col-sm-8">
                    <input
                      v-model="data['otaFromCabin']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label"
                    >*返程平台展示舱位</label
                  >
                  <div class="col-sm-8">
                    <input
                      v-model="data['otaRetCabin']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*去程旅行有效期</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['fromTravelStart']"
                      type="date"
                      class="form-control"
                      style="width:150px;display: inline"
                    />~
                    <input
                      v-model="data['fromTravelEnd']"
                      type="date"
                      class="form-control"
                      style="width:150px;display: inline"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*返程旅行有效期</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['retTravelStart']"
                      type="date"
                      class="form-control"
                      style="width:150px;display: inline"
                    />~
                    <input
                      v-model="data['retTravelEnd']"
                      type="date"
                      class="form-control"
                      style="width:150px;display: inline"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">去程旅行排除日期</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['fromTravelExcept']"
                      type="text"
                      class="form-control"
                      placeholder="例子：20190807-20190809,20190706"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">返程旅行排除日期</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['retTravelExcept']"
                      type="text"
                      class="form-control"
                      placeholder="例子：20190807-20190809,20190706"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">中转</label>
                  <div class="col-sm-8 pt-5">
                    <input
                      type="checkbox"
                      v-model="transit"
                      :true-value="true"
                      :false-value="false"
                      @change="transitChange"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0" v-if="transit">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*去程中转航司</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['fromTransitCarrier']"
                      type="text"
                      class="form-control"
                      placeholder="填写单个航司二字码, 只能填写一个航司，如UO"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*返程中转航司</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['retTransitCarrier']"
                      type="text"
                      class="form-control"
                      placeholder="填写单个航司二字码, 只能填写一个航司，如UO"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0" v-if="transit">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*去程中转机场</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['transitAirport']"
                      type="text"
                      class="form-control"
                      style="width: 120px; display: inline"
                      placeholder="三位机场编码"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*返程中转机场</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['transAirportRet']"
                      type="text"
                      class="form-control"
                      style="width: 120px; display: inline"
                      placeholder="三位机场编码"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0" v-if="transit">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*去程中转航班号</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['fromTransitFlightNumber']"
                      type="text"
                      class="form-control"
                      placeholder="单个航班号或ALL"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*返程中转航班号</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['retTransitFlightNumber']"
                      type="text"
                      class="form-control"
                      placeholder="单个航班号或ALL"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0" v-if="transit">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*去程中转舱位</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['fromTransitCabin']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="
                  data['tripType'] ===
                    $store.state.constant.priceAdjustTripType.rw.value
                "
                class="col-md-6 mb-0"
              >
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*返程中转舱位</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['retTransitCabin']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <h6 class="txt-dark capitalize-font ml-15">调价规则</h6>
            <hr class="light-grey-hr mt-5 mb-5" />
            <div class="row mb-0 mt-5">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*销售日期</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['sellStart']"
                      type="date"
                      class="form-control"
                      style="width:150px;display: inline"
                    />~
                    <input
                      v-model="data['sellEnd']"
                      type="date"
                      class="form-control"
                      style="width:150px;display: inline"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*票价范围</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['priceMin']"
                      type="text"
                      class="form-control"
                      style="width: 100px; display: inline; background-color: #212121"
                      v-bind:disabled="this.data['cabinMatch']"
                      placeholder="最低票价"
                    />~
                    <input
                      style="width:120px;display: inline; background-color: #212121"
                      v-model="data['priceMax']"
                      type="text"
                      class="form-control"
                      placeholder="最高票价"
                      v-bind:disabled="this.data['cabinMatch']"
                    />
                    <input
                      id="cabinMatch"
                      @click="cabinMatchClick"
                      v-model="data['cabinMatch']"
                      type="checkbox"
                      class="ml-5 mt-10"
                    />
                    <label for="cabinMatch">启用舱位匹配</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*提前出票时限</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['ticketTime']"
                      type="text"
                      class="form-control"
                      placeholder="小时数"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">备注</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['note']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*成人留点</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['adultPricePercent']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*成人留钱</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['adultPriceAdd']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*成人税费</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['adultTaxAdd']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*儿童留点</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['childPricePercent']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*儿童留钱</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['childPriceAdd']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-0">
              <div class="col-md-6 mb-0">
                <div class="form-group mb-5 required">
                  <label class="col-sm-4 control-label">*儿童税费</label>
                  <div class="col-sm-8">
                    <input
                      v-model="data['childTaxAdd']"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer pt-0 pb-5 pr-30">
            <button
              type="button"
              class="btn btn-primary btn-sm btn-icon left-icon"
              @click="save"
            >
              <i class="fa fa-save"></i><span>保存</span>
            </button>
            <button
              type="button"
              class="btn btn-default btn-sm btn-icon left-icon"
              data-dismiss="modal"
            >
              <i class="fa fa-times"></i><span>关闭</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
// 引入弹框
import {showEditDialog} from "../../../../../public/t_js/spider"
// 外部引入
import ErrorModal from "@/components out/ErrorModal";
import Log from "@/components out/LogModal";
import validator from "@/service/validator";
import connector from "@/service/connector";
import moment from "moment";
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
  name: "PriceAdjustSearch",
  components: {
    ErrorModal,
    Log,
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
      searchCondition: {
        routeReturn: false,
        platform: "jyskequnar",
        tripType: "0",
        kind: 0,
        state: "",
        fromCarrier: "",
        type: 0,
      },
      logVisible: false, // 日志面板
      dataId: 0,
      dataList: [],
      tableColumns: [
        {
          prop: "fromCarrier",
          label: "航司",
        },
        {
          prop: "fromFlightNumber",
          label: "航班号",
        },
        {
          prop: "fromCabin",
          label: "舱位",
        },
        {
          prop: "kind",
          label: "类别",
        },
        {
          prop: "ticketTime",
          label: "出票",
        },
        {
          prop: "adultPricePercent",
          label: "成点",
        },
        {
          prop: "adultPriceAdd",
          label: "成钱",
        },
        {
          prop: "adultTaxAdd",
          label: "成税",
        },
        {
          prop: "childPricePercent",
          label: "儿点",
        },
        {
          prop: "childPriceAdd",
          label: "儿钱",
        },
        {
          prop: "childTaxAdd",
          label: "儿税",
        },
      ],
      page: {
        pageSize: 100,
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
      transit: false,
      dataTemplate: {
        tripType: this.$store.state.constant.priceAdjustTripType.ow.value,
        cabinMatch: false,
        priceMin: 1,
        priceMax: 100000,
        ticketTime: 72,
        adultPriceAdd: 0,
        adultPricePercent: 0,
        adultTaxAdd: 0,
        childPriceAdd: 0,
        childPricePercent: 0,
        childTaxAdd: 0,
        type: this.$store.state.constant.priceAdjustType.public.value,
      },
      batchData: {},
      operateType: "",
      otaConfigList: [],
      selectAll: "false",
      batchUpdateTripType: 1,
    };
  },
  mounted() {
    let requestData = { page: { pageSize: 100, currentPage: 1 } };
    connector
      // .gatewaySericeAxios()
      .post("/ota_config/list.do", requestData)
      .then((resp) => {
        this.otaConfigList = resp["data"]["list"];
      });
  },
  methods: {
    // 按钮
    async search(currentPage) {
      this.selectAll = "false";
      this.dataList = [];
      this.page["currentPage"] = currentPage;
      this.searchCondition["pageParam"] = {
        pageNum: currentPage,
        pageSize: this.page["pageSize"],
      };
      // connector
      //   .priceSericeAxios()
      //   .post("/priceAdjust/search", this.searchCondition)
      //   .then((resp) => {
      //     console.log("数据搜索返回的内容:", resp);
      //     this.dataList = resp["data"]["list"];
      //     this.dataList.forEach((d) => {
      //       d["checked"] = false;
      //     });
      //     this.page["currentPage"] = currentPage;
      //     this.page["goPage"] = currentPage;
      //     connector.extractPriceAdminPage(this.page, resp);
      //   });
      // alert("发送post");
      let { data } = await this.axios.post(
        "/priceAdjust/search",
        this.searchCondition
      );
      console.log(data.list);
      this.dataList = data.list;
    },
    // 输入框 行程类型
    check() {
      this.data = JSON.parse(JSON.stringify(this.data));
    },
    // 按钮日志
    itemLog(data) {
      this.dataId = data.id;
      this.logVisible = true;
    },
    // 表格
    stateChange(data) {
      console.log("RoutingId:%s Status:%s", data["id"], data["status"]);
      connector.priceSericeAxios().post("/priceAdjust/update", data);
    },
    // 表格 复选框
    selectAllClick() {
      console.log("SelectAll:%s %s", typeof this.selectAll, this.selectAll);
      this.dataList.forEach((d) => {
        d["checked"] = this.selectAll === "false";
      });
    },
    // input
    cabinMatchClick() {
      this.data["cabinMatch"] = !this.data["cabinMatch"];
      console.log("Data:", this.data["cabinMatch"]);
      if (this.data["cabinMatch"]) {
        this.data["priceMin"] = 1;
        this.data["priceMax"] = 1;
      }
    },
    // 封装的函数
    getSelectedDataIds() {
      let ids = [];
      this.dataList.forEach((d) => {
        if (d["checked"]) {
          ids.push(d["id"]);
        }
      });
      return ids;
    },
    // 按钮批量上架
    batchOnline() {
      if (this.getSelectedDataIds().length === 0) {
        return;
      }
      let requestData = { ids: this.getSelectedDataIds() };
      requestData["param"] = {
        state: this.$store.state.constant.priceAdjustState.online.value,
      };
      console.log("批量上线提交的报文:", requestData);
      connector
        .priceSericeAxios()
        .post("/priceAdjust/updateBatch", requestData)
        .then(() => {
          this.search(this.page["currentPage"]);
        });
    },
    // 按钮批量下架
    batchOffline() {
      if (this.getSelectedDataIds().length === 0) {
        return;
      }
      let requestData = { ids: this.getSelectedDataIds() };
      requestData["param"] = {
        state: this.$store.state.constant.priceAdjustState.offline.value,
      };
      console.log("批量下线提交的报文:", requestData);
      connector
        .priceSericeAxios()
        .post("/priceAdjust/updateBatch", requestData)
        .then(() => {
          this.search(this.page["currentPage"]);
        });
    },
    // 按钮批量删除
    batchDelete() {
      if (this.getSelectedDataIds().length === 0) {
        return;
      }
      let requestData = { ids: this.getSelectedDataIds() };
      connector
        .priceSericeAxios()
        .post("/priceAdjust/delete", requestData)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    // 按钮清空
    reset() {
      this.searchCondition = {};
    },
    // 中转
    transitChange() {
      console.log(this.transit);
      if (!this.transit) {
        delete this.data["fromTransitCarrier"];
        delete this.data["fromTransitFlightNumber"];
        delete this.data["transitAirport"];
        delete this.data["fromTransitCabin"];
        delete this.data["retTransitCarrier"];
        delete this.data["retTransitFlightNumber"];
        delete this.data["transitAirportRet"];
        delete this.data["retTransitCabin"];
      }
    },
    // 按钮新建
    openCreateDialog() {
      this.operateType = "create";
      this.data = JSON.parse(JSON.stringify(this.dataTemplate));
      this.transit = false;
      // eslint-disable-next-line no-undef
      showEditDialog();
    },
    // 表格 复制按钮
    copyPriceAdjust(data) {
      this.dataTemplate = JSON.parse(JSON.stringify(data));
      delete this.dataTemplate["id"];
      this.dataTemplate["fromTravelStart"] = moment(
        this.dataTemplate["fromTravelStart"],
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
      this.dataTemplate["fromTravelEnd"] = moment(
        this.dataTemplate["fromTravelEnd"],
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
      this.dataTemplate["sellStart"] = moment(
        this.dataTemplate["sellStart"],
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
      this.dataTemplate["sellEnd"] = moment(
        this.dataTemplate["sellEnd"],
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
      if (
        this.dataTemplate["tripType"] ===
        this.$store.state.constant.priceAdjustTripType.rw.value
      ) {
        this.dataTemplate["retTravelStart"] = moment(
          this.dataTemplate["retTravelStart"],
          "YYYYMMDD"
        ).format("YYYY-MM-DD");
        this.dataTemplate["retTravelEnd"] = moment(
          this.dataTemplate["retTravelEnd"],
          "YYYYMMDD"
        ).format("YYYY-MM-DD");
      }
    },
    // 表格 编辑按钮
    deletePriceAdjust(data) {
      let requestData = { ids: [] };
      requestData.ids.push(data["id"]);
      connector
        .priceSericeAxios()
        .post("/priceAdjust/delete", requestData)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    // 表格按钮编辑
    openEditDialog(data) {
      this.operateType = "edit";
      this.transit = false;
      this.data = this.data = JSON.parse(JSON.stringify(data));

      this.data["fromTravelStart"] = moment(
        this.data["fromTravelStart"],
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
      this.data["fromTravelEnd"] = moment(
        this.data["fromTravelEnd"],
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
      this.data["sellStart"] = moment(
        this.data["sellStart"],
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
      this.data["sellEnd"] = moment(this.data["sellEnd"], "YYYYMMDD").format(
        "YYYY-MM-DD"
      );
      if (
        this.data["tripType"] ===
        this.$store.state.constant.priceAdjustTripType.rw.value
      ) {
        this.data["retTravelStart"] = moment(
          this.data["retTravelStart"],
          "YYYYMMDD"
        ).format("YYYY-MM-DD");
        this.data["retTravelEnd"] = moment(
          this.data["retTravelEnd"],
          "YYYYMMDD"
        ).format("YYYY-MM-DD");
      }
      if (
        this.data["fromTransitCarrier"] &&
        this.data["fromTransitCarrier"] != ""
      ) {
        this.transit = true;
      }
      if (this.data.retInterval && this.data.retInterval !== "") {
        this.data.retStart = this.data.retInterval.split("-")[0];
        this.data.retEnd = this.data.retInterval.split("-")[1];
      }
      this.data["cabinMatch"] =
        1 === this.data["priceMin"] &&
        this.data["priceMin"] === this.data["priceMax"];
      // eslint-disable-next-line no-undef
      showEditDialog();
    },
    // 按钮批量修改
    openBatchEditDialog() {
      this.batchData = {};
      if (this.getSelectedDataIds().length === 0) {
        return;
      }
      let tripTypes = this.dataList
        .filter((d) => d.checked)
        .map((d) => d.tripType);
      tripTypes = new Set(tripTypes);
      console.log(tripTypes);
      if (tripTypes.size > 1) {
        this.$msgError("请选择同类型政策批量修改");
        return;
      }
      this.batchUpdateTripType = Array.from(tripTypes)[0];
      // eslint-disable-next-line no-undef
      showSecondEditDialog();
    },
    // 按钮保存
    saveBatchData() {
      let requestData = { ids: this.getSelectedDataIds() };
      let param = {};
      let keys = Object.keys(this.batchData);
      keys.forEach((k) => {
        if (this.batchData[k]) {
          if (
            k == "fromTravelStart" ||
            k == "fromTravelEnd" ||
            k == "sellStart" ||
            k == "sellEnd" ||
            k == "retTravelStart" ||
            k == "retTravelEnd"
          ) {
            param[k] = this.batchData[k].replace(/-/g, "");
          } else {
            param[k] = this.batchData[k];
          }
        }
      });
      if (Object.keys(param).length === 0) {
        return;
      }
      requestData["param"] = param;
      console.log("批量修改的数据为", requestData);
      connector
        .priceSericeAxios()
        .post("/priceAdjust/updateBatch", requestData)
        .then(() => {
          this.search(this.page["currentPage"]);
          this.selectAll = "false";
          // eslint-disable-next-line no-undef
          hideSecondEditDialog();
        });
    },
    // 按钮保存
    save() {
      if (this.operateType === "create") {
        this.create();
      } else {
        this.update();
      }
    },
    // 封装的方法
    create() {
      this.dataCheckAndFix();
      this.data[
        "kind"
      ] = this.$store.state.constant.priceAdjustKind.manual.value;
      console.log("新建调价数据:", this.data);
      if (
        this.data.retStart &&
        this.data.retEnd &&
        Number(this.data.retEnd) > 0
      ) {
        this.data.retInterval = this.data.retStart + "-" + this.data.retEnd;
        validator.intervalCheck(this.data.retInterval, true);
      }
      connector
        .priceSericeAxios()
        .post("/priceAdjust/add", this.data)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    // 封装的方法
    update() {
      this.dataCheckAndFix();
      console.log("修改的调价数据:", this.data);
      if (
        this.data.retStart &&
        this.data.retEnd &&
        Number(this.data.retEnd) > 0
      ) {
        this.data.retInterval = this.data.retStart + "-" + this.data.retEnd;
        validator.intervalCheck(this.data.retInterval, true);
      }
      connector
        .priceSericeAxios()
        .post("/priceAdjust/update", this.data)
        .then(() => {
          this.search(this.page["currentPage"]);
          // eslint-disable-next-line no-undef
          hideEditDialog();
        });
    },
    // 按钮下载模板
    downloadTemplate() {
      connector
        .priceSericeAxios()
        .get("/priceAdjust/downloadTemplate", { responseType: "blob" })
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
    // 按钮导出数据
    exportData() {
      connector
        .priceSericeAxios()
        .post("/priceAdjust/exportFile", this.searchCondition, {
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
          link.setAttribute("download", "price_adjust.xlsx");
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
        .post("/priceAdjust/uploadFile", formData)
        .then((resp) => {
          console.log("报文上传返回的结果为:", resp);
          // eslint-disable-next-line no-unused-vars
          if (resp.code == 0) this.$msgSuccess(resp.message);
          else this.$msgError(resp.message);
        })
        .catch((e) => {
          this.$msgError(e.message);
        });
    },
    // 封装的函数
    dataCheckAndFix() {
      validator.twoLetterNumberCheck(
        this.data["fromCarrier"],
        true,
        "去程航司"
      );
      validator.valueNullCheck(this.data["platform"], true, "平台");
      validator.threeLetterCheck(this.data["depAirPort"], true, "去程离港机场");
      validator.threeLetterCheck(this.data["arrAirPort"], true, "去程到达机场");
      validator.valueNullCheck(this.data["fromFlightNumber"], true, "去程航班");
      validator.valueNullCheck(this.data["fromCabin"], true, "去程舱位");
      validator.valueNullCheck(this.data["otaFromCabin"], true, "去程OTA舱位");
      validator.startEndTimeCheck(
        this.data["fromTravelStart"],
        this.data["fromTravelEnd"],
        true,
        "去程旅行"
      );
      validator.startEndTimeCheck(
        this.data["sellStart"],
        this.data["sellEnd"],
        true,
        "销售"
      );
      validator.numberCheck(this.data["priceMin"], 1, 10000, true, "最小价格");
      validator.numberCheck(
        this.data["priceMax"],
        1,
        1000000,
        true,
        "最大价格"
      );
      validator.numberFormatCheck(this.data["ticketTime"], true, "出票时间");
      validator.numberFormatCheck(this.data["adultPriceAdd"], true, "成人留钱");
      validator.numberFormatCheck(
        this.data["adultPricePercent"],
        true,
        "成人留点"
      );
      validator.numberFormatCheck(this.data["adultTaxAdd"], true, "成人税费");
      validator.numberFormatCheck(this.data["childPriceAdd"], true, "儿童留钱");
      validator.numberFormatCheck(
        this.data["childPricePercent"],
        true,
        "儿童留点"
      );
      validator.numberFormatCheck(this.data["childTaxAdd"], true, "儿童税费");
      this.data["fromTravelStart"] = this.data["fromTravelStart"].replace(
        new RegExp("-", "g"),
        ""
      );
      this.data["fromTravelEnd"] = this.data["fromTravelEnd"].replace(
        new RegExp("-", "g"),
        ""
      );
      this.data["sellStart"] = this.data["sellStart"].replace(
        new RegExp("-", "g"),
        ""
      );
      this.data["sellEnd"] = this.data["sellEnd"].replace(
        new RegExp("-", "g"),
        ""
      );
      if (
        this.data["tripType"] ===
        this.$store.state.constant.priceAdjustTripType.rw.value
      ) {
        validator.threeLetterCheck(
          this.data["depAirPortRet"],
          true,
          "去程离港机场"
        );
        validator.threeLetterCheck(
          this.data["arrAirPortRet"],
          true,
          "去程到达机场"
        );
        validator.valueNullCheck(
          this.data["retFlightNumber"],
          true,
          "去程航班"
        );
        validator.valueNullCheck(this.data["retCabin"], true, "去程舱位");
        validator.valueNullCheck(this.data["otaRetCabin"], true, "去程OTA舱位");
        validator.startEndTimeCheck(
          this.data["retTravelStart"],
          this.data["retTravelEnd"],
          true,
          "去程旅行"
        );
        this.data["retTravelStart"] = this.data["retTravelStart"].replace(
          new RegExp("-", "g"),
          ""
        );
        this.data["retTravelEnd"] = this.data["retTravelEnd"].replace(
          new RegExp("-", "g"),
          ""
        );
      }
    },
  },
};
</script>

<style scoped>
label{
  font-family: cursive; color: #275c73;
}
</style>