<template>
  <div>
    <div style="float:left">
      <div class="infoOrder">
        <div class="labeldiv">
          <span class="infolabel">订单信息</span>
        </div>
        <input type="button" id="test" data-clipboard-action="copy" data-clipboard-target="#card" value="复制"
          style="display: none" />
        <table class="mytable">
          <thead>
            <tr>
              <td>平台</td>
              <td>订单号</td>
              <td>创建日期</td>
              <td>生单PNR</td>
              <td>行程</td>
              <td>总价</td>
              <td>备注</td>
              <td>催</td>
              <td>锁单人</td>
            </tr>
          </thead>
         <tr>
            <td>
              <span>{{ order.data.src }}</span>
              <span>{{ order.data.company }}</span>
            </td>
            <td v-text="order.orderno"></td>
            <td v-text="order.data.timeCreate"></td>
            <td v-text="order.data.pnrCode" @click="confirmTktIssue(order.data.pnrcode)"></td>
            <td>
              <span v-if="order.locker != oper">{{ order.data.tripType }}</span>
              <select v-if="order.locker == oper" v-model="order.data.tripType" v-on:change="triptypechg()">
                <option></option>
                <option>单程</option>
                <option>往返</option>
                <option>缺口</option>
              </select>
            </td>
            <td v-text="order.data.total"></td>
            <td>
              <input type="text" @change="orderRmkModi()" v-model="order.data.rmk" :readonly="order.locker != oper" />
            </td>
            <td>
              <span :style="{ color: order.data.UrgeTimes > 0 ? 'red' : 'black' }">{{ order.data.UrgeTimes }}</span>
              <el-button type="warning" size="mini" @click="showReminder" style="padding: 3px 8px; margin-left: 5px;">催单
              </el-button>
            </td>
            <td>
              <span v-if="order.locker">{{ order.locker }}</span>
              <span class="sbtn" v-if="order.locker" @click="unlock()">
                解锁</span>
              <span class="sbtn" v-if="!order.locker" @click="lock()">锁定</span>
            </td>
          </tr>
        </table>
      </div>
      <!--催单弹窗-->
      <!-- <el-dialog title="备注" :visible.sync="reminderDialog" @close="hideReminder">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="reminderRemarks">
        </el-input>
        <div @click="quickFill" style="margin-top: 5px;">
          <el-tag class="eltag">查询票号/核实出票</el-tag>
          <el-tag class="eltag">13位票号</el-tag>
          <el-tag class="eltag">需要过关</el-tag>
          <el-tag class="eltag">行程有变</el-tag>
          <el-tag class="eltag">催出票</el-tag>
          <el-tag class="eltag">回程订单催出</el-tag>
          <el-tag class="eltag">未出票需要分离编码</el-tag>
          <el-tag class="eltag">小二查票</el-tag>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hideReminder">取 消</el-button>
          <el-button type="primary" @click="postReminder" :loading="reminderLoading" :disabled="reminderLoading">确 定
          </el-button>
        </div>
      </el-dialog> -->
      <!--催单弹窗-->
      <!-- 行程信息 -->
      <div class="infoRoute">
        <div class="labeldiv">
          <span class="infolabel">行程信息</span>
        </div>
        <table class="mytable">
          <thead>
            <tr>
              <td>行程</td>
              <td>起飞时间</td>
              <td>降落时间</td>
              <td>航班号</td>
              <td>舱位</td>
              <td>销售价</td>
              <td>税</td>
            </tr>
          </thead>
          <tr v-for="(route, index) of routes" :key="index">
            <td>
              {{ route.route }}
              <span v-if="route.isGaiQi == 1" style="color:red;">改</span>
            </td>
            <td>{{ route.timeDep }}</td>
            <td>{{ route.timeArr }}</td>
            <td>
              {{ route.flightNo }}
              <span style="color:red;" v-if="route.flightNo != route.flightNoOrg">({{ route.flightNoOrg }})</span>
            </td>
            <td v-text="route.cabin"></td>
            <td v-text="route.price"></td>
            <td v-text="route.tax"></td>
          </tr>
        </table>
      </div>
      <!-- 行程信息 -->
      <!-- 航班信息 -->
      <div class="infoSeg">
        <div class="labeldiv">
          <span class="infolabel">航段信息</span>
        </div>
        <table class="mytable">
          <thead>
            <tr>
              <td>航段</td>
              <td>订 <br />舱</td>
              <td>出 <br />舱</td>
              <td>id</td>
              <td>乘机人信息</td>
              <td>证件信息</td>
              <td>辅营 <br />信息</td>
              <td>出票<br />PNR</td>
              <td>票号</td>
              <td>假回填</td>
              <td>占位</td>
              <td>机票 <br />利润</td>
              <td>辅营 <br />利润</td>
              <td>采购信息</td>
              <td></td>
              <td>操作</td>
            </tr>
          </thead>
          <tr v-for="(seg,index) of segs" :key="index">
                        <td>{{seg.data.route}}
                            <br>{{seg.data.price}} {{seg.data.tax}}
                            <br>{{seg.data.segStat}}
                            <span v-if="seg.data.isGaiQi==1" style="color:red;"><br>改</span>
                        </td>
                        <td v-text="seg.data.cabin"></td>
                        <td v-text="seg.data.cabinIssue"></td>
                        <td v-text="seg.id"></td>
                        <td>{{seg.data.pName}}
                            <br> {{seg.data.ageType}} {{seg.data.gender}} {{seg.data.nation}}
                            <br> {{seg.data.birthday}}
                            <br><span style="color:red" v-if="seg.data.ageType=='婴儿'">({{seg.data.parentName}})</span>
                        </td>
                        <td>{{seg.data.idType}}
                            <br> {{seg.data.idNo}}
                            <br> {{seg.data.idExpire}}</td>
                        <td>
                            {{seg.data.bag}} {{seg.data.bagPrice}}
                            <br>{{seg.data.meal}} {{seg.data.mealPrice}}
                            <br>{{seg.data.seat}} {{seg.data.seatPrice}}
                        </td>
                        <td v-text="seg.data.tktIssuePnr"></td>
                        <td v-text="seg.data.tktNo"></td>
                        <td v-text="seg.data.tktFake"></td>
                        <td v-text="seg.data.tktWaste"></td>
                        <td v-text="seg.data.profitJp"></td>
                        <td v-text="seg.data.profitExtra"></td>
                        <td>
                            {{seg.data.tktIssueChannel}} {{seg.data.tktIssueOper}} <br> {{seg.data.tktIssueAcct}} {{seg.data.tktIssuePrice}} {{seg.data.tktIssuePriceFrn}} <br> {{seg.data.tktIssueSerial}} <br> {{seg.data.tktIssueMail}} <br> {{seg.data.tktIssueTime}}
                            <span style="color:red;" v-if="seg.data.tktIssueTime && seg.data.tktIssueTime.substr(0,10)!=seg.data.tktIssueDat"><br>采购账期：{{seg.data.tktIssueDat}}</span>

                        </td>
                        <td>{{seg.data.rmk}}</td>
                        <td style="text-align:center">
                            <span v-if="(seg.data.chngjpfundids!=undefined&&seg.data.chngjpfundids.length>0&&seg.data.segStat!='申请退票')||(seg.data.oldsegid!=undefined&&seg.data.oldsegid!='')">
                                <input type="button" value="撤销改签" v-on:click="RevokeChngCheck(seg.id)">
                                <br /> 改签次数: {{seg.data.chngjpfundids!=undefined?seg.data.chngjpfundids.length:1}}
                            </span>

                            <span class="sbtn" v-if="seg.data.segStat=='待出票' && seg.data.ageType=='婴儿'" @click='segCancel(seg)'>取消</span>
                        </td>
                    </tr>
        </table>
      </div>
      <!-- 航班信息 -->
      <!-- 航变信息 -->
      <div class="infoFlightDepChange">
        <div class="labeldiv">
          <span class="infolabel">航变信息</span>
        </div>
        <table class="mytable">
          <thead>
            <tr>
              <td>添加时间</td>
              <td>行程</td>
              <td>航班号</td>
              <td>起飞时间</td>
              <td>降落时间</td>
              <td>变更后航班号</td>
              <td>变更后起飞时间</td>
              <td>变更后降落时间</td>
              <td>通知人</td>
              <td>通知时间</td>
              <td>状态</td>
            </tr>
          </thead>
          <tr v-for="(chng,index) of flightDepchng" style="color: red " :key="index">
                        <td>{{chng.dat}}</td>
                        <td>{{chng.data.route}}</td>
                        <td>{{chng.data.flightNoOrg}}</td>
                        <td>{{chng.data.timeDepOrg}}</td>
                        <td>{{chng.data.timeArrOrg}}</td>
                        <td>{{chng.data.flightNo}}</td>
                        <td>{{chng.data.timeDep}}</td>
                        <td>{{chng.data.timeArr}}</td>
                        <td>{{chng.oper}}</td>
                        <td>{{chng.timeop}}</td>
                        <td>{{chng.data.stat}}</td>
                    </tr>
        </table>
      </div>
      <!-- 航变信息 -->
      <!-- 辅营信息 -->
      <div class="infoExtra">
        <div class="labeldiv">
          <span class="infolabel">辅营信息</span>
        </div>
        <table class="mytable">
          <thead>
            <tr>
              <td>辅营单号</td>
              <td>航段\乘机人</td>
              <td>处理状态</td>
              <td>验真</td>
              <td>工单类型</td>
              <td>项目</td>
              <td>金额</td>
              <td>操作员</td>
              <td>添加时间</td>
              <td>采购支付</td>
              <td>支付科目</td>
              <td>卡号/流水号</td>
              <td>操作员</td>
              <td>处理时间</td>
              <td></td>
            </tr>
          </thead>
          <tr v-for="(e,index) in segExtra.filter(x=>x.id>0)" :key="index">
                        <td><input type="text" readonly="readonly" style="border: none;width:80px;" v-model="e.data.extraNo"></td>
                        <td>{{e.data.route}}<br>{{e.data.pName}} </td>
                        <td>{{e.data.stat}}</td>
                        <td>{{e.data.check}}</td>
                        <td v-text="e.data.ctg"></td>
                        <td v-text="e.data.ctg=='行李' ? (e.data.item+'kg'):e.data.item"></td>
                        <td v-text="e.data.rcv"></td>
                        <td v-text="e.data.rcvOper"></td>
                        <td v-text="e.data.rcvTime"></td>
                        <td v-text="e.data.pay"></td>
                        <td v-text="e.data.payAcct"></td>
                        <td v-text="e.data.paySerial"></td>
                        <td v-text="e.data.payOper"></td>
                        <td v-text="e.data.payTime"></td>
                        <td><span class="sbtn" v-if="e.data.stat=='待处理'" @click='extraItemShow(e)'>操作</span></td>
                    </tr>
          <tr>
                        <td colspan="13" style="text-align: right;">
                            <div id='extraItemDiv' v-if='extraItem.data'>
                                <span>{{extraItem.data.ctg}} - {{extraItem.data.item}}</span>
                                <span>采购支付：</span>
                                <input type="number" @change="extraItem.data.payOper=='' ? extraItem.data.payOper='-':1==1" v-model="extraItem.data.pay">
                                <span>采购科目：</span>
                                <select style="width:120px;" v-model="extraItem.data.payAcct">
                                    <option v-for="(item,index) in configs.tktIssuePayType" :key="index">
                                        {{item}}
                                    </option>
                                </select>
                                <span>采购渠道：</span>
                                <select style="width:120px;" v-model="extraItem.data.payChannel">
                                    <option v-for="(item,index) of configs.tktIssueChannel" :key="index">
                                        {{item}}
                                    </option>
                                </select>
                                <input style="width: 165px;" type="text" placeholder="流水号" v-model="extraItem.data.paySerial" />
                                <el-date-picker style="width: 165px;" v-model="extraItem.data.payTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" type="datetime" size="mini" placeholder="支付时间"></el-date-picker>
                                <input v-if="extraItem.data.stat=='待处理'  || configs.operAuth.includes('辅营项目调整')" type="button" value="保存" style="width: 80px;" @click="extraSave(extraItem)">
                                <input v-if="extraItem.data.stat=='待处理'  || configs.operAuth.includes('辅营项目调整')" type="button" value="申请携程VCC" style="width: 120px;" @click="qcard(extraItem)">
                                <input v-if="extraItem.data.stat=='待处理' && extraItem.data.airCo=='IT' && extraItem.data.ctg=='行李'  && configs.operAuth.includes('辅营项目调整')" id="itBagApi" type="button" value="自动添加行李(API)" style="width: 150px;" @click="itAutoBagAdd(extraItem)">
                            </div>
                        </td>
                    </tr>
        </table>
      </div>
      <!-- 辅营信息 -->
      <!-- 质检信息 -->
      <div class="infoExtra">
        <div class="labeldiv">
          <span class="infolabel">质检信息</span>
        </div>
        <table class="mytable">
          <thead>
            <tr>
              <td>工单时间</td>
              <td>质检单号</td>
              <td>申诉方</td>
              <td>申诉类型</td>
              <td>赔付金额</td>
              <td>违约金</td>
              <td>扣分</td>
              <td>申诉日期</td>
              <td>申诉状态</td>
              <td>实扣金额</td>
              <td>实扣分</td>
              <td>处理日期</td>
              <td>责任人</td>
              <td>添加备注</td>
              <td>申诉备注</td>
              <td>处理备注</td>
            </tr>
          </thead>
          <tr v-for="(item, index) in qualitytestinglist" :key="index">
                        <td>{{item.orderDate}}</td>
                        <td>
                            <a :href="'/order/qualitytestingsheet.htm?r='+Math.random()+'&zjnumber='+item.zjnumber"> {{item.zjnumber}} </a>
                        </td>
                        <td>{{item.complainant}}</td>
                        <td>{{item.appealType}}</td>
                        <td>{{item.payforMoney}}</td>
                        <td>{{item.defaultMoney}}</td>
                        <td>{{item.deduction}}</td>
                        <td>{{item.appealDate}}</td>
                        <td>{{item.appealState}}</td>
                        <td>{{item.actualPayforMoney}}</td>
                        <td>{{item.actualDeduction}}</td>
                        <td>{{item.dealDate}}</td>
                        <td>{{item.personLiable}}</td>
                        <td>
                            <el-tooltip placement="top">
                                <div slot="content"> {{item.addRemark}} </div>
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </td>
                        <td>
                            <el-tooltip placement="top">
                                <div slot="content"> {{item.appealRemark}} </div>
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </td>
                        <td>
                            <el-tooltip placement="top">
                                <div slot="content"> {{item.dealRemark}} </div>
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </td>
                    </tr>
        </table>
      </div>
      <!-- 质检信息 -->
      <!-- 资金流水 -->
      <div class="infoExtra">
        <div class="labeldiv">
          <span class="infolabel">资金流水</span>
        </div>
        <table class="mytable">
          <thead>
            <tr>
              <td>账单日期</td>
              <td>类型</td>
              <td>订单号</td>
              <td>流水号</td>
              <td>收入金额</td>
              <td>支出金额</td>
              <td>备注</td>
            </tr>
          </thead>
          <tr v-for="(d,index) in matchs" :key="index">
                        <td>{{d.data.bsDat}}</td>
                        <td>{{d.data.bsType}}</td>
                        <td>{{d.data.orderNo}}</td>
                        <td>{{d.data.bsSerial}}</td>
                        <td>{{d.data.inTotal}}</td>
                        <td>{{d.data.outTotal}}</td>
                        <td>{{d.data.memo}}</td>
                    </tr>
        </table>
      </div>
      <!-- 资金流水 -->
      <div style="text-align: left;margin: 20px;">
        <input
          class="btn btn-warning"
          type="button"
          value="取消订单"
          @click="orderCancel"
          :disabled="order.locker != oper"
        />

        <input
          style="margin-left: 300px;"
          class="btn btn-primary"
          type="button"
          value="新建工单"
          @click="showExtraDiv()"
          :disabled="order.locker != oper"
        />

        <a
          v-if="'IT,UO,ZA,VJ,VZ,TW,TR,KR,RS'.indexOf(segs[0].data.airCo) >= 0"
          style="margin-left: 30px;"
          target="_blank"
          :href="
            '/aftersale/travelitinerary/itinerary' +
              segs[0].data.airCo +
              '.htm?r=' +
              Math.random() +
              '&orderNo=' +
              order.orderno +
              '&pnr=' +
              fakePNRGen()
          "
          >行程单</a
        >
        <a
          v-if="segs[0].data.airCo == 'IT'"
          style="margin-left: 30px;"
          target="_blank"
          :href="
            '/aftersale/travelitinerary/itineraryit2.htm?r=' +
              Math.random() +
              '&orderNo=' +
              order.orderno +
              '&pnr=' +
              fakePNRGen()
          "
          >验真专用</a
        >
        <a
          v-if="segs[0].data.airCo == 'ZE'"
          style="margin-left: 30px;"
          target="_blank"
          :href="
            '/aftersale/travelitinerary/ZE/index.htm?r=' +
              Math.random() +
              '&orderNo=' +
              order.orderno +
              '&pnr=' +
              fakePNRGen()
          "
          >行程单</a
        >
        <a
          v-if="segs[0].data.airCo == 'SL'"
          style="margin-left: 30px;"
          target="_blank"
          :href="
            '/aftersale/travelitinerary/SL/index.htm?r=' +
              Math.random() +
              '&orderNo=' +
              order.orderno +
              '&pnr=' +
              fakePNRGen()
          "
          >行程单</a
        >
        <a
          v-if="segs[0].data.airCo == 'BX'"
          style="margin-left: 30px;"
          target="_blank"
          :href="
            '/aftersale/travelitinerary/BX/index.htm?r=' +
              Math.random() +
              '&orderNo=' +
              order.orderno +
              '&pnr=' +
              fakePNRGen()
          "
          >行程单</a
        >
        <a
          v-if="segs[0].data.airCo == 'LJ'"
          style="margin-left: 30px;"
          target="_blank"
          :href="
            '/aftersale/travelitinerary/LJ/index.htm?r=' +
              Math.random() +
              '&orderNo=' +
              order.orderno +
              '&pnr=' +
              fakePNRGen()
          "
          >行程单</a
        >
        <a
          v-if="['3K', 'GK', 'BL'].includes(segs[0].data.airCo)"
          style="margin-left: 30px;"
          target="_blank"
          :href="
            '/aftersale/travelitinerary/3KGKBL/index.htm?r=' +
              Math.random() +
              '&orderNo=' +
              order.orderno +
              '&pnr=' +
              fakePNRGen()
          "
          >行程单</a
        >
        <a
          v-if="segs[0].data.airCo == 'DD'"
          style="margin-left: 30px;"
          target="_blank"
          :href="
            '/aftersale/travelitinerary/DD/index.htm?r=' +
              Math.random() +
              '&orderNo=' +
              order.orderno +
              '&pnr=' +
              fakePNRGen()
          "
          >行程单</a
        >

        <a
          style="margin-left: 30px;"
          target="_blank"
          :href="
            '/order/qualitytestingsheet.htm?r=' +
              Math.random() +
              '&orderNo=' +
              order.orderno +
              '&platform=' +
              encodeURI(order.data.src)
          "
          >质检工单</a
        >

        <span v-if="['UO', 'XW', 'TW'].includes(segs[0].data.airCo)">
          <input
            type="text"
            v-model="fakepnr"
            style="margin-left: 30px; width: 100px;"
            placeholder="邮件PNR"
          />
          <span
            style="margin-left: 30px; color: #337ab7; cursor: pointer;"
            @click="mailPreview(segs[0].data.airCo, order.orderno)"
            >邮件预览</span
          >
          <span
            style="margin-left: 30px; color: #337ab7; cursor: pointer;"
            @click="mailSend(segs[0].data.airCo, order.orderno)"
            >一键发送</span
          >
        </span>
      </div>
      <div class="infoExtra">
        <div class="labeldiv">
          <span class="infolabel">文件信息</span>
        </div>
        <div style="margin: 10px 0 10px 5px; width: 100%;">
          <el-upload
            action="string"
            ref="upload"
            :on-preview="handlePreview"
            :on-change="beforeUpload"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            :multiple="true"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="uploadFile"
              :disabled="fileList.length == 0"
              >上传到服务器</el-button
            >
          </el-upload>
          <div style="margin: 5px 0">
            <span>已有文件：</span>
            <span
              v-for="(file, index) in order.data.filelist"
              :key="index"
              style="margin-right: 10px"
            >
              <a :href="'/orderfile/' + orderno + '/' + file" target="_blank">{{
                file
              }}</a>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style="float: left;margin-left: 10px;">
      <div class="infoLog">
        <div class="labeldiv">
          <span @click="showView" class="infolabel">日志信息</span>
        </div>
        <form @submit.prevent="rmkSave">
          <input
            style="width:600px;"
            v-model="freeRmk"
            type="text"
            placeholder="备注信息"
          />
          <input type="submit" value="保存" />
        </form>

        <table class="mytable">
          <thead>
            <tr>
              <td style="width:160px;white-space:nowrap;">类别/操作员</td>
              <td>操作</td>
            </tr>
          </thead>
          <tr
            :class="{ small: log.ctg === '查看', red: log.ctg == '备注' }"
            v-for="(log, index) in logs"
            :key="index"
          >
            <td class="logCol1">
              {{ log.ctg }} {{ log.oper }} <br />
              {{ log.dat }}
            </td>
            <td v-text="log.op"></td>
          </tr>
        </table>
      </div>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="行李" name="xingli">
          <table class="tbl" id="xingli" style="width:100%">
            <thead>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    :checked="isCheckAll"
                    @click="selectAll('行李')"
                  />
                </td>
                <td rowspan="2">行程</td>
                <td rowspan="2">姓名</td>
                <td rowspan="2">航段状态</td>
                <td rowspan="2">辅营状态</td>
                <td rowspan="2">辅营单号</td>
                <td rowspan="2">行李重量</td>
                <td colspan="3">实收</td>
                <td colspan="4">实付</td>
                <td rowspan="2">操作</td>
              </tr>
              <tr>
                <td></td>
                <td>收款金额</td>
                <td>收款账号</td>
                <td>收款流水号/时间</td>
                <td>收款金额</td>
                <td>支付账号</td>
                <td>采购渠道</td>
                <td>支付流水号/时间</td>
              </tr>
            </thead>
            <tr v-for="ex of segExtra.filter((x) => x.data.ctg == '行李')">
              <td>
                <input
                  v-if="ex.data.stat == '待处理'"
                  type="checkbox"
                  @change="checkOne(ex, '行李')"
                  v-model="ex.isCheck"
                />
              </td>
              <td v-text="ex.data.route"></td>
              <td v-text="ex.data.pName"></td>
              <td v-text="ex.data.segStat"></td>
              <td v-text="ex.data.stat"></td>
              <td>
                <input
                  style="width: 100px;"
                  type="text"
                  v-model="ex.data.extraNo"
                  placeholder="辅营单号"
                />
              </td>
              <td>
                <select style="width:50px;" v-model="ex.data.item">
                  <option>15</option>
                  <option>20</option>
                  <option>25</option>
                  <option>30</option>
                  <option>35</option>
                  <option>40</option>
                  <option>50</option>
                  <option>60</option>
                  <option>70</option>
                  <option>80</option>
                </select>
              </td>
              <td>
                <input
                  @change="
                    ex.data.rcvOper == '' ? (ex.data.rcvOper = '-') : 1 == 1
                  "
                  style="width: 60px;"
                  type="number"
                  v-model="ex.data.rcv"
                  placeholder="实收"
                />
              </td>
              <td>
                <select
                  style="width:120px;"
                  v-model="ex.data.rcvAcct"
                  @change="rcvAcctChange('行李', $event)"
                >
                  <option v-for="item of configs.rcvAccts">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  style="width: 165px;"
                  type="text"
                  placeholder="流水号"
                  v-model="ex.data.rcvSerial"
                />
                <br />
                <el-date-picker
                  style="width: 165px;"
                  v-model="ex.data.rcvTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="收款时间"
                ></el-date-picker>
              </td>

              <td>
                <input
                  v-if="ex.data.segStat == '出票完成'"
                  @change="
                    ex.data.payOper == '' ? (ex.data.payOper = '-') : 1 == 1
                  "
                  style="width: 60px;"
                  type="number"
                  v-model="ex.data.pay"
                  placeholder="实付"
                />
              </td>
              <td>
                <select
                  style="width:120px;"
                  v-if="ex.data.segStat == '出票完成'"
                  v-model="ex.data.payAcct"
                  @change="payAcctChange('行李', $event)"
                >
                  <option v-for="item of configs.tktIssuePayType">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <select
                  style="width:120px;"
                  v-if="ex.data.segStat == '出票完成'"
                  v-model="ex.data.payChannel"
                  @change="payChannelChange('行李', $event)"
                >
                  <option v-for="item of configs.tktIssueChannel">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  v-if="ex.data.segStat == '出票完成'"
                  style="width: 165px;"
                  type="text"
                  placeholder="流水号"
                  v-model="ex.data.paySerial"
                />
                <br />
                <el-date-picker
                  style="width: 165px;"
                  v-if="ex.data.segStat == '出票完成'"
                  v-model="ex.data.payTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="支付时间"
                >
                </el-date-picker>
              </td>

              <td>
                <input
                  v-if="
                    ['取消', '待处理'].includes(ex.data.stat) ||
                      configs.operAuth.includes('辅营项目调整')
                  "
                  type="button"
                  value="保存"
                  style="width: 80px;"
                  @click="extraSave(ex)"
                />
              </td>
            </tr>
          </table>
        </el-tab-pane> -->
      <!-- <el-tab-pane label="餐食" name="meal">
          <table class="tbl" style="width:100%">
            <thead>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    :checked="isCheckAll"
                    @click="selectAll('餐食')"
                  />
                </td>
                <td rowspan="2">行程</td>
                <td rowspan="2">姓名</td>
                <td rowspan="2">航段状态</td>
                <td rowspan="2">辅营状态</td>
                <td rowspan="2">辅营单号</td>
                <td rowspan="2">餐食项目</td>
                <td colspan="3">实收</td>
                <td colspan="4">实付</td>
                <td rowspan="2">操作</td>
              </tr>
              <tr>
                <td></td>
                <td>收款金额</td>
                <td>收款账号</td>
                <td>收款流水号/时间</td>
                <td>支付金额</td>
                <td>支付账号</td>
                <td>采购渠道</td>
                <td>支付流水号/时间</td>
              </tr>
            </thead>
            <tr v-for="ex of segExtra.filter((x) => x.data.ctg == '餐食')">
              <td>
                <input
                  v-if="ex.data.stat == '待处理'"
                  type="checkbox"
                  @change="checkOne(ex, '餐食')"
                  v-model="ex.isCheck"
                />
              </td>
              <td v-text="ex.data.route"></td>
              <td v-text="ex.data.pName"></td>
              <td v-text="ex.data.segStat"></td>
              <td v-text="ex.data.stat"></td>
              <td>
                <input
                  style="width: 100px;"
                  type="text"
                  v-model="ex.data.extraNo"
                  placeholder="辅营单号"
                />
              </td>
              <td>
                <input
                  style="width: 80px;"
                  type="text"
                  v-model="ex.data.item"
                  placeholder="鸡肉饭"
                />
              </td>
              <td>
                <input
                  @change="
                    ex.data.rcvOper == '' ? (ex.data.rcvOper = '-') : 1 == 1
                  "
                  style="width: 60px;"
                  type="number"
                  v-model="ex.data.rcv"
                  placeholder="实收"
                />
              </td>
              <td>
                <select
                  style="width:120px;"
                  v-model="ex.data.rcvAcct"
                  @change="rcvAcctChange('餐食', $event)"
                >
                  <option v-for="item of configs.rcvAccts">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  style="width: 165px;"
                  type="text"
                  placeholder="流水号"
                  v-model="ex.data.rcvSerial"
                />
                <br />
                <el-date-picker
                  style="width: 165px;"
                  v-model="ex.data.rcvTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="收款时间"
                ></el-date-picker>
              </td>

              <td>
                <input
                  v-if="ex.data.segStat == '出票完成'"
                  @change="
                    ex.data.payOper == '' ? (ex.data.payOper = '-') : 1 == 1
                  "
                  style="width: 60px;"
                  type="number"
                  v-model="ex.data.pay"
                  placeholder="实付"
                />
              </td>
              <td>
                <select
                  style="width:120px;"
                  v-if="ex.data.segStat == '出票完成'"
                  v-model="ex.data.payAcct"
                  @change="payAcctChange('餐食', $event)"
                >
                  <option v-for="item of configs.tktIssuePayType">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <select
                  style="width:120px;"
                  v-if="ex.data.segStat == '出票完成'"
                  v-model="ex.data.payChannel"
                  @change="payChannelChange('餐食', $event)"
                >
                  <option v-for="item of configs.tktIssueChannel">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  v-if="ex.data.segStat == '出票完成'"
                  style="width: 165px;"
                  type="text"
                  placeholder="流水号"
                  v-model="ex.data.paySerial"
                />
                <br />
                <el-date-picker
                  style="width: 165px;"
                  v-if="ex.data.segStat == '出票完成'"
                  v-model="ex.data.payTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="支付时间"
                >
                </el-date-picker>
              </td>

              <td>
                <input
                  v-if="
                    ['取消', '待处理'].includes(ex.data.stat) ||
                      configs.operAuth.includes('辅营项目调整')
                  "
                  type="button"
                  value="保存"
                  style="width: 80px;"
                  @click="extraSave(ex)"
                />
              </td>
            </tr>
          </table>
        </el-tab-pane> -->

      <!-- <el-tab-pane label="值机" name="seat">
          <table class="tbl" style="width:100%">
            <thead>
              <tr>
                <td rowspan="2">行程</td>
                <td rowspan="2">姓名</td>
                <td rowspan="2">航段状态</td>
                <td rowspan="2">辅营状态</td>
                <td rowspan="2">辅营单号</td>
                <td rowspan="2">值机项目</td>
                <td colspan="3">实收</td>
                <td colspan="4">实付</td>
                <td rowspan="2">操作</td>
              </tr>
              <tr>
                <td>收款金额</td>
                <td>收款账号</td>
                <td>收款流水号/时间</td>
                <td>支付金额</td>
                <td>支付账号</td>
                <td>采购渠道</td>
                <td>支付流水号/时间</td>
              </tr>
            </thead>
            <tr v-for="ex of segExtra.filter((x) => x.data.ctg == '值机')">
              <td v-text="ex.data.route"></td>
              <td v-text="ex.data.pName"></td>
              <td v-text="ex.data.segStat"></td>
              <td v-text="ex.data.stat"></td>
              <td>
                <input
                  style="width: 100px;"
                  type="text"
                  v-model="ex.data.extraNo"
                  placeholder="辅营单号"
                />
              </td>
              <td>
                <input
                  style="width: 80px;"
                  type="text"
                  v-model="ex.data.item"
                  placeholder="靠窗 16A"
                />
              </td>
              <td>
                <input
                  @change="
                    if (ex.data.rcvOper == '') {
                      ex.data.rcvOper = '-';
                    }
                  "
                  style="width: 60px;"
                  type="number"
                  v-model="ex.data.rcv"
                  placeholder="实收"
                />
              </td>
              <td>
                <select
                  style="width:120px;"
                  v-model="ex.data.rcvAcct"
                  @change="rcvAcctChange('值机', $event)"
                >
                  <option v-for="item of configs.rcvAccts">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  style="width: 165px;"
                  type="text"
                  placeholder="流水号"
                  v-model="ex.data.rcvSerial"
                />
                <br />
                <el-date-picker
                  style="width: 165px;"
                  v-model="ex.data.rcvTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="收款时间"
                ></el-date-picker>
              </td>

              <td>
                <input
                  v-if="ex.data.segStat == '出票完成'"
                  @change="
                    if (ex.data.payOper == '') {
                      ex.data.payOper = '-';
                    }
                  "
                  style="width: 60px;"
                  type="number"
                  v-model="ex.data.pay"
                  placeholder="实付"
                />
              </td>
              <td>
                <select
                  style="width:120px;"
                  v-if="ex.data.segStat == '出票完成'"
                  v-model="ex.data.payAcct"
                  @change="payAcctChange('值机', $event)"
                >
                  <option v-for="item of configs.tktIssuePayType">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <select
                  style="width:120px;"
                  v-if="ex.data.segStat == '出票完成'"
                  v-model="ex.data.payChannel"
                  @change="payChannelChange('值机', $event)"
                >
                  <option v-for="item of configs.tktIssueChannel">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  v-if="ex.data.segStat == '出票完成'"
                  style="width: 165px;"
                  type="text"
                  placeholder="流水号"
                  v-model="ex.data.paySerial"
                />
                <br />
                <el-date-picker
                  style="width: 165px;"
                  v-if="ex.data.segStat == '出票完成'"
                  v-model="ex.data.payTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="支付时间"
                >
                </el-date-picker>
              </td>

              <td>
                <input
                  v-if="
                    ['取消', '待处理'].includes(ex.data.stat) ||
                      configs.operAuth.includes('辅营项目调整')
                  "
                  type="button"
                  value="保存"
                  style="width: 80px;"
                  @click="extraSave(ex)"
                />
              </td>
            </tr>
          </table>
        </el-tab-pane> -->

      <!-- <el-tab-pane label="改名" name="gaiming">
          <table class="tbl" style="width:100%">
            <thead>
              <tr>
                <td style="width:250px;">姓名</td>
                <td>性别</td>
                <td>生日</td>
                <td>国籍</td>
                <td>证件类型</td>
                <td>证件号</td>
                <td>证件到期日</td>
                <td>实收</td>
                <td>实付</td>
                <td>操作</td>
              </tr>
            </thead>
            <tr v-for="people of peoples">
              <td>
                <input
                  type="text"
                  v-model="people.data.pName"
                  placeholder="姓名"
                />
                <select style="width:50px;" v-model="people.data.ageType">
                  <option>成人</option>
                  <option>儿童</option>
                </select>
              </td>
              <td>
                <select style="width:50px;" v-model="people.data.gender">
                  <option>男</option>
                  <option>女</option>
                </select>
              </td>
              <td>
                <el-date-picker
                  style="width:140px;"
                  v-model="people.data.birthday"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  size="mini"
                  placeholder="选择时间"
                ></el-date-picker>
              </td>
              <td><input type="text" v-model="people.data.nation" /></td>
              <td>
                <select v-model="people.data.idType">
                  <option v-for="item of configs.idTypes">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  v-model="people.data.idNo"
                  placeholder="证件号"
                />
              </td>
              <td>
                <el-date-picker
                  style="width:140px;"
                  v-model="people.data.idExpire"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  size="mini"
                  placeholder="选择时间"
                ></el-date-picker>
              </td>
              <td>
                <input
                  @change="
                    people.data.rcvOper == ''
                      ? (people.data.rcvOper = '-')
                      : 1 == 1
                  "
                  style="width: 80px;"
                  type="number"
                  v-model="people.data.rcv"
                  placeholder="实收"
                />
                <input
                  style="width: 140px;"
                  type="text"
                  placeholder="流水号"
                  v-model="people.data.rcvSerial"
                />
                <br />
                <select style="width:224px;" v-model="people.data.rcvAcct">
                  <option v-for="item of configs.rcvAccts">
                    {{ item }}
                  </option>
                </select>
                <el-date-picker
                  style="width: 224px;"
                  v-model="people.data.rcvTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="收款时间"
                ></el-date-picker>

              </td>
              <td>
                <input
                  @change="
                    people.data.payOper == ''
                      ? (people.data.payOper = '-')
                      : 1 == 1
                  "
                  style="width: 80px;"
                  type="number"
                  v-model="people.data.pay"
                  placeholder="实付"
                />
                <input
                  style="width: 160px;"
                  type="text"
                  placeholder="流水号"
                  v-model="people.data.paySerial"
                />
                <br />
                <select style="width: 120px;" v-model="people.data.payAcct">
                  <option v-for="item of configs.tktIssuePayType">
                    {{ item }}
                  </option>
                </select>
                <select style="width: 120px;" v-model="people.data.payChannel">
                  <option v-for="item of configs.tktIssueChannel">
                    {{ item }}
                  </option>
                </select>
                <el-date-picker
                  style="width: 224px;"
                  v-model="people.data.payTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="支付时间"
                ></el-date-picker>
              </td>
              <td>
                <input
                  type="button"
                  value="保存"
                  style="width: 80px;"
                  @click="nameChngSave(people)"
                />
              </td>
            </tr>
          </table>

          <br />
          <br />
          <table
            class="tbl"
            style="width:100%"
            v-if="order.logs.filter((x) => x.ctg == '改名').length > 0"
          >
            <thead>
              <tr>
                <td>时间</td>
                <td>操作员</td>
                <td>类别</td>
                <td>操作</td>
              </tr>
            </thead>
            <tr
              v-bind:class="{ small: log.ctg === '查看' }"
              v-for="log of order.logs.filter((x) => x.ctg == '改名')"
            >
              <td v-text="log.dat"></td>
              <td v-text="log.oper"></td>
              <td v-text="log.ctg"></td>
              <td
                v-text="log.op"
                style="word-wrap:break-word;word-break:break-all;"
              ></td>
            </tr>
          </table>
        </el-tab-pane> -->

      <!-- <el-tab-pane label="退票" name="tuipiao">
          <table class="tbl" style="width:100%">
            <thead>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    :checked="isCheckAll"
                    @click="selectAll('退票')"
                  />
                </td>
                <td>行程</td>
                <td>姓名</td>
                <td>起飞/到达</td>
                <td>航班号</td>
                <td>舱位</td>
                <td>票价</td>
                <td>收款</td>
                <td>采购支付</td>
                <td>采购渠道</td>
                <td>采购科目</td>
                <td>航段状态</td>
                <td>假回填</td>
                <td>票号</td>
                <td>退票类别</td>
                <td>航司应退</td>
                <td>应退客人</td>
                <td>实退客人</td>
                <td>退票备注</td>
              </tr>
            </thead>
            <tr
              v-for="seg of segs.filter(
                (x) =>
                  x.data.segStat == '待出票' || x.data.segStat == '出票完成'
              )"
            >
              <td>
                <input
                  type="checkbox"
                  @change="checkOne(seg, '退票')"
                  v-model="seg.isCheck"
                  v-if="seg.data.pName != ''"
                />
              </td>
              <td v-text="seg.data.route"></td>
              <td>
                <span :class="{ red: seg.data.ageType == '儿童' }">{{
                  seg.data.ageType
                }}</span>
                {{ seg.data.pName }}
              </td>
              <td>{{ seg.data.timeDep }} <br />{{ seg.data.timeArr }}</td>
              <td>{{ seg.data.flightNo }}</td>
              <td>{{ seg.data.cabin }}</td>
              <td>{{ seg.data.price }}_{{ seg.data.tax }}</td>
              <td>
                {{ parseFloat(seg.data.price) + parseFloat(seg.data.tax) }}
              </td>
              <td>{{ seg.data.tktIssuePrice }}</td>
              <td>{{ seg.data.tktIssueChannel }}</td>
              <td>{{ seg.data.tktIssueAcct }}</td>
              <td>{{ seg.data.segStat }}</td>
              <td>{{ seg.data.tktFake }}</td>
              <td>{{ seg.data.tktNo }}</td>
              <td>
                <select
                  v-model="seg.data.refundType"
                  style="width:100px"
                  @change="refundTypeChange($event, seg)"
                >
                  <option></option>
                  <option>自愿退票</option>
                  <option>非自愿</option>
                  <option>NoShow</option>
                  <option>虎航签证</option>
                  <option>航班延误</option>
                  <option>航班取消</option>
                  <option>病退</option>
                  <option>武汉肺炎疫情</option>
                </select>
              </td>
              <td>
                <input
                  style="width: 100px;"
                  type="number"
                  v-model="seg.data.airCoYinShou"
                  @input="changeAirCo($event, seg)"
                />
              </td>
              <td>
                <input
                  style="width: 100px;"
                  type="number"
                  v-model="seg.data.psgrYinFu"
                  @input="changePass($event, seg)"
                />
              </td>
              <td>
                <input
                  style="width: 100px;"
                  type="number"
                  v-model="seg.data.rfdPsgrPay"
                  @input="changePsgrPay($event, seg)"
                />
              </td>
              <td>
                <input
                  style="width: 270px;"
                  type="text"
                  v-model="seg.data.refundRmk"
                  @input="changeRemark($event, seg)"
                />
              </td>
            </tr>
          </table>

          <div style="text-align: center;padding: 10px;">
            <input
              type="button"
              value="提交退票"
              style="width: 200px;"
              @click="checkrefund()"
            />
          </div>
        </el-tab-pane> -->

      <!-- <el-tab-pane label="改签" name="gaiqi">
          <table class="tbl">
            <thead>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    :checked="isCheckAll"
                    @click="selectAll('改签')"
                  />
                </td>
                <td>行程</td>
                <td>姓名</td>
                <td>起飞</td>
                <td>到达</td>
                <td>航班号</td>
                <td>舱位</td>
                <td>票价</td>
                <td>税</td>
                <td>票号</td>
                <td>实收客人</td>
                <td>原票改签</td>
                <td>重出改签</td>
              </tr>
            </thead>
            <tr
              v-for="seg of segs.filter(
                (x) =>
                  x.data.segStat == '待出票' || x.data.segStat == '出票完成'
              )"
            >
              <td>
                <input
                  type="checkbox"
                  @change="checkOne(seg, '改签')"
                  v-model="seg.isCheck"
                />
              </td>
              <td>
                {{ seg.data.route }}
              </td>
              <td>
                {{ seg.data.pName }}
              </td>
              <td>
                <el-date-picker
                  style="width: 165px;"
                  v-model="seg.data.timeDep"
                  value-format="yyyy-MM-dd HH:mm:00"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="选择时间"
                ></el-date-picker>
              </td>
              <td>
                <el-date-picker
                  style="width: 165px;"
                  v-model="seg.data.timeArr"
                  value-format="yyyy-MM-dd HH:mm:00"
                  format="yyyy-MM-dd HH:mm"
                  type="datetime"
                  size="mini"
                  placeholder="选择时间"
                ></el-date-picker>
              </td>
              <td>
                <input
                  style="width: 65px;"
                  type="text"
                  v-model="seg.data.flightNo"
                />
              </td>
              <td>
                <input
                  style="width: 40px;"
                  type="text"
                  v-model="seg.data.cabin"
                />
              </td>
              <td>
                <input
                  style="width: 65px;"
                  type="number"
                  v-model="seg.data.price"
                />
              </td>
              <td>
                <input
                  style="width: 65px;"
                  type="number"
                  v-model="seg.data.tax"
                />
              </td>
             
              <td>
                {{ seg.data.tktNo }}
                <br />
                {{ seg.data.segStat }}
                <span v-if="seg.data.isGaiQi == 1" style="color:red;"
                  ><br />改</span
                >
              </td>
              <td>
                <input
                  style="width: 80px;"
                  type="number"
                  v-model="seg.data.gaiqiInfo.rcv"
                  placeholder="改签费"
                />
                <input
                  type="text"
                  placeholder="流水号"
                  v-model="seg.data.gaiqiInfo.rcvSerial"
                />
                <br />
                <select v-model="seg.data.gaiqiInfo.rcvAcct">
                  <option v-for="item of configs.rcvAccts">
                    {{ item }}
                  </option>
                </select>
                <br />
                <input
                  type="button"
                  value="确认改签"
                  v-on:click="chng(seg, '未出票改签')"
                  v-if="seg.data.tktNo == ''"
                />
              </td>
              <td>
                <span v-if="seg.data.tktNo != ''">
             
                  <input
                    type="button"
                    style="margin: 0px 10px;"
                    value="提交原票改签"
                    v-on:click="chng(seg, '原票改签')"
                  />
                </span>
              </td>
              <td>
                <span v-if="seg.data.tktNo != ''">
                  <input
                    style="width: 100px;"
                    type="number"
                    v-model="seg.data.gaiqiInfo.airCoAR"
                    placeholder="航司应退"
                  />
                  <input
                    type="button"
                    value="提交重出改签"
                    v-on:click="chng(seg, '重出改签')"
                  />
                </span>
              </td>
            </tr>
          </table>
        </el-tab-pane> -->

      <!-- <el-tab-pane label="添加婴儿/儿童" name="addpeople">
          <table class="tbl" style="width:100%; margin-top:5px">
            <thead>
              <tr>
                <td>辅营单号</td>
                <td>父母姓名</td>
                <td>姓名</td>
                <td>性别</td>
                <td>生日</td>
                <td>国籍</td>
                <td>单程票价</td>
                <td>单程税</td>
                <td>实收</td>
                <td>实付</td>
                <td>操作</td>
              </tr>
            </thead>
            <tr>
              <td>
                <input
                  style="width:80px;"
                  type="text"
                  v-model="extraBabyNew.extraNo"
                  placeholder="辅营单号"
                />
              </td>
              <td>
                <select
                  style="width: 100px;"
                  @change="addInfOrChd"
                  v-model="extraBabyNew.parentName"
                >
                  <option></option>
                  <option v-for="n of adultNames">{{ n }}</option>
                </select>
                <span>{{ extraBabyNew.ctg }}</span>
              </td>
              <td>
                <input
                  type="text"
                  v-model="extraBabyNew.pName"
                  placeholder="姓名"
                />
              </td>
              <td>
                <select v-model="extraBabyNew.gender">
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </td>
              <td>
                <el-date-picker
                  style="width: 130px;"
                  v-model="extraBabyNew.birthday"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  size="mini"
                  placeholder="选择时间"
                ></el-date-picker>
              </td>
              <td>
                <input
                  style="width:80px;"
                  type="text"
                  v-model="extraBabyNew.nation"
                  placeholder="国籍"
                /><br />
                <select style="width:80px;" v-model="extraBabyNew.idType">
                  <option v-for="t of configs.idTypes">{{ t }}</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  style="width: 100px;"
                  v-model="extraBabyNew.price"
                  placeholder="单程票价"
                /><br />
                <input
                  type="text"
                  v-model="extraBabyNew.idNo"
                  placeholder="证件号码"
                  style="width: 100px;"
                />
              </td>
              <td>
                <input
                  type="number"
                  style="width: 100px;"
                  v-model="extraBabyNew.tax"
                  placeholder="单程税"
                /><br />
                <el-date-picker
                  style="width: 130px;"
                  v-model="extraBabyNew.idExpire"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  size="mini"
                  placeholder="证件有效期"
                ></el-date-picker>
              </td>
              <td>
                <input
                  @change="
                    extraBabyNew.rcvOper == ''
                      ? (extraBabyNew.rcvOper = '-')
                      : 1 == 1
                  "
                  style="width: 80px;"
                  type="number"
                  v-model="extraBabyNew.rcv"
                  placeholder="实收"
                />
                <input
                  style="width: 140px;"
                  type="text"
                  placeholder="流水号"
                  v-model="extraBabyNew.rcvSerial"
                />
                <br />
                <select style="width:224px;" v-model="extraBabyNew.rcvAcct">
                  <option v-for="item of configs.rcvAccts">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  @change="
                    extraBabyNew.payOper == ''
                      ? (extraBabyNew.payOper = '-')
                      : 1 == 1
                  "
                  style="width: 80px;"
                  type="number"
                  v-model="extraBabyNew.pay"
                  placeholder="实付"
                />
                <input
                  style="width: 160px;"
                  type="text"
                  placeholder="流水号"
                  v-model="extraBabyNew.paySerial"
                />
                <br />
                <select style="width: 120px;" v-model="extraBabyNew.payAcct">
                  <option v-for="item of configs.tktIssuePayType">
                    {{ item }}
                  </option>
                </select>
                <select style="width: 120px;" v-model="extraBabyNew.payChannel">
                  <option v-for="item of configs.tktIssueChannel">
                    {{ item }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  type="button"
                  value="保存"
                  style="width: 80px;"
                  @click="extraBabySave(extraBabyNew)"
                />
              </td>
            </tr>
          </table>
        </el-tab-pane> -->

      <!-- <el-tab-pane label="说明" name="remark">
          <ul class="extrarmk">
            <li>
              行李、餐食、值机、 改名 这四种辅营项目 当选择了收款账号和付款账号
              保存后辅营项目状态即变更为已处理
             
            </li>
          </ul>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
  // import qryobj from '../../../../../config/dingdan';
  // import dataGet from '../../../../../config/dingdan';
  export default {
    data() {
      return {
        orderno: "",
        fileList: [],
        fakepnr: "", // 邮件预览和发送时使用
        isCheckAll: false,
        configs: "",
        checkedItems: [],
        flightDepchng: [],
        freeRmk: "",
        isShowViewLog: false,
        logs: [],
        order: "",
        routes: [],
        segs: "",
        segExtra: "",
        bags: "",
        extra: "",
        extraItem: "",
        activeName: "xingli",
        chngsegs: "",
        times: [],
        peoples: [],
        newpeoples: [], //新增婴儿
        oper: "",
        extraBabys: [],
        extraChilds: [],
        adultNames: [],
        extraBabyNew: {
          orderNo: "",
          extraNo: "",
          airCo: "",
          route: "",
          parentName: "",
          parentName4Chd: "",
          pName: "",
          gender: "男",
          birthday: "",
          idType: "",
          idNo: "",
          idExpire: "",

          nation: "CN",
          price: 0,
          tax: 0,

          ctg: "儿童",
          stat: "待处理",

          item: "添加儿童",

          rcv: "",
          rcvAcct: "",
          rcvTime: "",
          rcvOper: "",
          rcvSerial: "",
          pay: "",
          payAcct: "",
          payTime: "",
          payOper: "",
          paySerial: "",
          payChannel: "",
        },
        reminderDialog: false, // 催单弹窗控制
        reminderRemarks: "", // 催单备注
        reminderLoading: false,
        matchs: [], //账单
        qualitytestinglist: [],
      };
    },
    mounted() {
      this.axios
        .post("/order/configs", [
          "opers",
          "operAuth",
          "idTypes",
          "orderChannel",
          "tktIssueChannel",
          "tktIssuePayType",
          "rcvAccts",
        ])
        .then((rtn) => {
          this.configs = rtn.configs;
        }),

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

      this.orderno = this.qryobj(location.search).orderNo;
      // this.orderno = location.search;
      // alert(this.orderno)
      this.dataGet(this.qryobj(location.search), this);
      this.getQualityTestingInfo(this);
    },
    methods: {
      /*上传文件*/
      submitUpload() {
        this.$refs.upload.submit();
      },
      uploadFile() {
        let {
          orderno,
          fileList
        } = this;
        console.log(fileList);
        let formData = new FormData();
        fileList.forEach((file) => {
          formData.append("file", file.raw, file.name);
        });
        this.uploading = true;
        this.axios({
            method: "POST",
            url: `/order/filesave/${orderno}`,
            data: formData,
          })
          .then((res) => {
            console.log(res);
            if (res.data) {
              alert("上传失败");
            } else {
              window.location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
            alert("上传失败");
          });
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file];
        console.log(this.fileList);
        return false;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = fileList;
      },
      handlePreview(file) {
        console.log(file);
      },

      mailPreview(airco, orderno) {
        console.log(airco, orderno);
        let fakepnr = this.fakepnr;
        if (!fakepnr || !/^[0-9A-Z]+\,*\\*\/*[0-9A-Z]*$/.test(fakepnr)) {
          alert("请检查PNR");
          return;
        }
        this.axios
          .post("/report/previewMail", {
            airCo: airco,
            orderNo: orderno,
            pnr: fakepnr,
          })
          .then((rtn) => {
            if (rtn.data.err) {
              console.log(rtn.data.msg);
            } else {
              window.open(rtn.data.data);
            }
          });
      },
      mailSend(airco, orderno) {
        let fakepnr = this.fakepnr;
        if (!fakepnr || !/^[0-9A-Z]+\,*\\*\/*[0-9A-Z]*$/.test(fakepnr)) {
          alert("请检查PNR");
          return;
        }
        this.axios
          .post("/report/sendMail", {
            airCo: airco,
            orderNo: orderno,
            pnr: fakepnr,
          })
          .then((rtn) => {
            console.log(rtn);
            if (!rtn.data.err) {
              console.log("发送成功");
              alert(rtn.data.msg);
            } else {
              console.log("发送失败");
              alert(rtn.data.msg);
            }
          });
      },
      // 订单催单
      quickFill: function (e) {
        this.reminderRemarks = e.target.textContent;
      },
      showReminder: function () {
        this.reminderDialog = true;
      },
      hideReminder: function () {
        this.reminderRemarks = "";
        this.reminderDialog = false;
      },
      postReminder: function () {
        if (this.reminderRemarks.trim() == "") return;
        this.reminderLoading = true;
        let orderNo = this.qryobj(location.search).orderNo;
        let remarks = this.reminderRemarks;
        this.axios
          .post("/order/reminder", {
            orderNo,
            remarks,
          })
          .then((rtn) => {
            if (!rtn.data.code) {
              msgOK("催单成功");
              console.log(rtn);
              this.order.data.UrgeTimes = rtn.data.data.UrgeTimes;
              this.logs = rtn.data.logs.sort((x, y) => (x.dat > y.dat ? -1 : 1));
              this.logs = this.logs.filter((x) => x.ctg != "查看");
            } else {
              msgError("催单失败");
            }
          })
          .catch((err) => {
            msgError("请求失败");
          })
          .finally(() => {
            this.hideReminder();
            this.reminderLoading = false;
          });
      },
      // 订单催单 end

      segCancel: function (seg) {
        layer.confirm(
          "确认要取消航段？", {
            icon: 3,
            title: "确认",
          },
          function (index) {
            layer.close(index);
            this.axios
              .post("/order/segCancel", {
                id: seg.id,
                orderNo: seg.data.orderNo,
                route: seg.data.route,
                pName: seg.data.pName,
                op: "取消航段",
              })
              .then((rtn) => {
                if (rtn.data == 1) {
                  seg.data.segStat = "已取消";
                  msgOK("航段已取消");
                } else {
                  alert("保存失败！请稍后重试。");
                }
              });
          }
        );
      },
      itAutoBagAdd(item) {
        this.axios.get("/order/getSegById/" + item.segid).then((res) => {
          let data = res.data;
          console.log(data);
          if (data && data.segStat == "出票完成") {
            this.axios
              .post("/order/addBaggage", {
                depAirPort: data.route.split("-")[0],
                arrAirPort: data.route.split("-")[1],
                flightNumber: data.flightNo,
                depDate: data.timeDep.substring(0, 16).replace(" ", "T") + ":00",
                pName: data.pName,
                baggageWeight: item.data.item,
                tktNo: data.tktIssuePnr,
                channel: data.tktIssueChannel,
              })
              .then((rtn) => {
                let r = rtn.data;
                console.log(r);
                try {
                  if (parseInt(r.status) === 0) {
                    item.data.pay = changeTwoDecimal(r.price);
                    item.data.payOper = "-";
                    item.data.payChannel = data.tktIssueChannel;
                    item.data.payAcct = data.tktIssueChannel;
                    item.data.paySerial = data.tktIssuePnr;
                    item.data.payTime = new Date().full();
                    let info = this.configs.rcvAccts.filter(
                      (x) => x.src == data.src
                    );
                    if (info.length > 0) {
                      item.data.rcvAcct = info[0].accts[0];
                    }
                    this.extraSave([item]);
                    $("#itBagApi").attr("disabled", true);
                  } else {
                    msgError("添加行李失败!请稍后再试", 2000);
                  }
                } catch (e) {
                  msgError("异常！", 2000);
                }
              })
              .catch(() => {
                msgError("请求异常,请稍后再试!", 2000);
              });
          } else {
            msgError("未出票!");
          }
        });
      },
      selectAll: function (ctg) {
        this.isCheckAll = !this.isCheckAll;
        if (ctg == "退票" || ctg == "改签") {
          let segs = this.segs.filter(
            (x) => x.data.segStat == "待出票" || x.data.segStat == "出票完成"
          );
          segs.forEach((x) => (x.isCheck = this.isCheckAll));
          let state = this.checkState(segs);
          if (this.isCheckAll) {
            this.segs.push({
              data: {
                airCoYinShou: this.segs[0].data.tktIssuePrice,
                psgrYinFu: parseFloat(this.segs[0].data.price) +
                  parseFloat(this.segs[0].data.tax),
                ageType: "",
                pName: "",
                timeDep: "",
                timeArr: "",
                flightNo: "",
                cabin: "",
                price: 0,
                tax: 0,
                tktIssuePrice: "",
                tktIssueChannel: "",
                tktIssueAcct: "",
                segStat: state,
                tktFake: "",
                tktNo: state == "出票完成" ? "fake" : "",
                refundType: "",
                refundRmk: "",
                rfdPsgrPay: "",
                gaiqiInfo: {
                  rcv: 0,
                  rcvSerial: "",
                  rcvAcct: "",
                },
              },
            });
          } else {
            this.segs.pop();
          }
        } else if (ctg == "行李" || ctg == "餐食") {
          this.segExtra
            .filter((x) => x.data.ctg == ctg && x.data.stat == "待处理")
            .forEach((x) => (x.isCheck = this.isCheckAll));
          let state = this.checkState(this.segExtra.filter((x) => x.data.ctg == ctg));
          if (this.isCheckAll) {
            this.segExtra.push({
              data: {
                ctg: ctg,
                pay: 0,
                rcv: 0,
                src: "",
                item: "",
                stat: "",
                airCo: "",
                check: "",
                pName: "",
                route: "",
                extraNo: "",
                orderNo: "",
                payAcct: "",
                payOper: "",
                payTime: "",
                rcvAcct: "",
                rcvOper: "",
                rcvTime: "",
                timeDep: "",
                checkRmk: "",
                checkOper: "",
                checkTime: "",
                paySerial: "",
                rcvSerial: "",
                payChannel: "",
                segStat: state,
              },
            });
          } else {
            this.segExtra.pop();
          }
        }
      },
      rcvAcctChange(val, event) {
        this.segExtra
          .filter((x) => x.data.ctg == val)
          .forEach((y) => (y.data.rcvAcct = event.target.value));
      },
      payAcctChange(val, event) {
        this.segExtra
          .filter((x) => x.data.ctg == val)
          .forEach((y) => (y.data.payAcct = event.target.value));
      },
      payChannelChange(val, event) {
        this.segExtra
          .filter((x) => x.data.ctg == val)
          .forEach((y) => (y.data.payChannel = event.target.value));
      },
      checkOne: function (item, ctg) {
        if (item.isCheck) {
          this.checkedItems.push(item);
        } else {
          this.checkedItems.splice(
            this.checkedItems.findIndex(
              (x) => x.pName == item.pName && x.route == item.route
            ),
            1
          );
        }
        if (ctg == "行李" || ctg == "餐食") {
          let state = this.checkState(this.checkedItems);
          if (item.isCheck && this.checkedItems.length == 1) {
            this.segExtra.push({
              data: {
                ctg: ctg,
                pay: 0,
                rcv: 0,
                src: "",
                item: "",
                stat: "",
                airCo: "",
                check: "",
                pName: "",
                route: "",
                extraNo: "",
                orderNo: "",
                payAcct: "",
                payOper: "",
                payTime: "",
                rcvAcct: "",
                rcvOper: "",
                rcvTime: "",
                timeDep: "",
                checkRmk: "",
                checkOper: "",
                checkTime: "",
                paySerial: "",
                rcvSerial: "",
                payChannel: "",
                segStat: state,
              },
            });
          } else if (!item.isCheck && this.checkedItems.length == 0) {
            this.segExtra.splice(
              this.segExtra.findIndex((x) => x.data.pName == ""),
              1
            );
          }
        } else if (ctg == "退票" || ctg == "改签") {
          let state = this.checkState(this.checkedItems);
          if (item.isCheck && this.checkedItems.length == 1) {
            let seg = this.segs.filter((s) => s.isCheck)[0];
            this.segs.push({
              data: {
                airCoYinShou: seg.data.tktIssuePrice,
                psgrYinFu: parseFloat(seg.data.price) + parseFloat(seg.data.tax),
                ageType: "",
                pName: "",
                timeDep: "",
                timeArr: "",
                flightNo: "",
                cabin: "",
                price: 0,
                tax: 0,
                tktIssuePrice: "",
                rfdPsgrPay: "",
                tktIssueChannel: "",
                tktIssueAcct: "",
                segStat: state,
                tktFake: "",
                tktNo: state == "出票完成" ? "fake" : "",
                refundType: seg.data.refundType,
                refundRmk: "",
                gaiqiInfo: {
                  rcv: 0,
                  rcvSerial: "",
                  rcvAcct: "",
                },
              },
            });
          } else if (!item.isCheck && this.checkedItems.length == 0) {
            this.segs.splice(
              this.segs.findIndex((x) => x.data.pName == ""),
              1
            );
          }
        }
      },
      chng: function (seg, type) {
        seg.data.gaiqiInfo.type = type;
        if (!seg.id || seg.data.pName == "") {
          this.segs.splice(
            this.segs.findIndex((item) => item.data.pName == ""),
            1
          );
          let data = this.segs.filter((x) => x.isCheck);
          data.forEach((y) => {
            if (seg.data.timeDep != "") y.data.timeDep = seg.data.timeDep;
            if (seg.data.timeArr != "") y.data.timeArr = seg.data.timeArr;
            if (seg.data.flightNo != "") y.data.flightNo = seg.data.flightNo;
            if (seg.data.cabin != "") y.data.cabin = seg.data.cabin;
            // if (seg.data.price != '') y.data.price = seg.data.price;
            // if (seg.data.tax != '') y.data.tax = seg.data.tax;
            // y.data.gaiqiInfo.rcv = seg.data.gaiqiInfo.rcv;
            y.data.gaiqiInfo.rcvSerial = seg.data.gaiqiInfo.rcvSerial;
            y.data.gaiqiInfo.rcvAcct = seg.data.gaiqiInfo.rcvAcct;
            y.data.gaiqiInfo.airCoAR = seg.data.gaiqiInfo.airCoAR;
            y.data.gaiqiInfo.type = type;
          });
          if (seg.data.price != "") this.cal(seg, data, "price");
          if (seg.data.tax != "") this.cal(seg, data, "tax");
          if (seg.data.gaiqiInfo.rcv != "") {
            let tmp = 0;
            for (let i = 0; i < data.length; i++) {
              let totalRcv = seg.data.gaiqiInfo.rcv;
              if (i + 1 < data.length) {
                data[i].data.gaiqiInfo.rcv = (totalRcv / data.length).toFixed(2);
                tmp = tmp + parseFloat((totalRcv / data.length).toFixed(2));
              } else {
                data[i].data.gaiqiInfo.rcv = totalRcv - tmp;
              }
            }
          }
          seg = this.segs;
        } else {
          seg = [seg];
        }
        console.log(seg);
        this.axios.post("/order/tktChng", seg).then((rtn) => {
          if (rtn.data == 1) {
            layer.closeAll();
            layer.msg("改签已提交", {
              icon: 1,
            });
          } else {
            alert("保存失败！请稍后重试");
          }
        });
      },
      orderRmkModi: function () {
        this.axios.post("/order/orderRmkModi", this.order.data).then((rtn) => {
          if (rtn.data > 0) {
            layer.msg("修改好了", {
              icon: 1,
            });
            ap.order.data.rmkOld = ap.order.data.rmk;
          }
        });
      },
      addInfOrChd: function () {
        if (this.extraBabyNew.parentName) {
          this.extraBabyNew.ctg = "婴儿";
          this.extraBabyNew.item = "添加婴儿";
        } else {
          this.extraBabyNew.ctg = "儿童";
          this.extraBabyNew.item = "添加儿童";
        }
      },
      lock: function () {
        this.axios
          .post("/order/lock", {
            id: ap.order.id,
          })
          .then((rtn) => {
            if (rtn.data.code == 0) {
              ap.order.locker = rtn.data.oper;
            } else {
              alert(rtn.data.msg);
            }
          });
      },
      unlock: function () {
        this.axios
          .post("/order/unlockOrder", {
            id: ap.order.id,
          })
          .then((rtn) => {
            console.log("unlock rtn:", rtn.data);
            if (rtn.data.code == 0) {
              ap.order.locker = "";
            } else {
              alert(rtn.data.msg);
            }
          });
      },
      handleClick(tab, event) {
        this.isCheckAll = false;
        this.segExtra.forEach((x) => (x.isCheck = this.isCheckAll));
        this.checkedItems = [];
      },
      showExtraDiv() {
        let app = this;
        layer.open({
          type: 1,
          area: ["1600px", "600px"],
          title: "辅营工单",
          content: $("#extraDiv"),
          zIndex: 1000,
          moveOut: true,
          end: function () {
            // reloadorder(location.search.qryobj(), app);
            this.dataGet(this.qryobj(location.search), app);
          },
        });
      },
      qcard(e) {
        if (e.data.pay == "" || e.data.pay == 0) {
          alert("请输入申请金额");
          return;
        }
        this.applyQcard();
        // axios.get('/api/order/getSegById/' + e.segid).then(rtn => {
        //     applyQcard(rtn.data.tktIssuePnr);
        // })
      },
      refundTypeChange(event, seg) {
        if (seg.data.pName == "") {
          this.segs.forEach((s) => {
            s.data.refundType = event.target.value;
            if (event.target.value == "自愿退票") {
              s.data.airCoYinShou = "";
              s.data.psgrYinFu = "";
            }
          });
        } else {
          if (event.target.value == "自愿退票") {
            seg.data.airCoYinShou = "";
            seg.data.psgrYinFu = "";
          }
        }
      },
      changeAirCo(event, seg) {
        console.log(event.target.value);
        if (seg.data.pName == "") {
          this.segs.forEach((s) => (s.data.airCoYinShou = event.target.value));
        }
      },
      changePass(event, seg) {
        if (seg.data.pName == "") {
          this.segs.forEach((s) => (s.data.psgrYinFu = event.target.value));
        }
      },
      changePsgrPay(event, seg) {
        if (seg.data.pName == "") {
          this.segs.forEach((s) => (s.data.rfdPsgrPay = event.target.value));
        }
      },
      changeRemark(event, seg) {
        if (seg.data.pName == "") {
          this.segs.forEach((s) => (s.data.refundRmk = event.target.value));
        }
      },
      checkrefund: function () {
        if (this.segs.filter((x) => x.isCheck).length > 0) {
          this.segs.splice(
            this.segs.findIndex((item) => item.data.pName == ""),
            1
          );
        }
        this.fncheckrefund(this);
      },
      chngCheck: function (id) {
        this.fnchngCheck(id, this);
      },
      yuantchngCheck: function (id) {
        //原票改签
        this.fnyuantchngCheck(id, this);
      },
      reoutchngCheck: function (id) {
        //重出改签
        this.fnreoutchngCheck(id, this);
      },
      RevokeChngCheck: function (id) {
        this.fnRevokeChngCheck(id, this);
      },
      checkbag: function (id) {
        this.fncheckbag(id, this);
      },
      checkmeal: function (id) {
        this.fncheckmeal(id, this);
      },
      checkseat: function (id) {
        this.fncheckseat(id, this);
      },
      checkpeopleshishou: function (pname) {
        this.fncheckpeopleshishou(pname, this);
      },
      checkpeopleshifu: function (pname) {
        this.fncheckpeopleshifu(pname, this);
      },
      addpeople: function () {
        var qry = this.qryobj(location.search);
        var people = {
          id: this.newpeoples.length + 1,
          orderno: qry.orderNo,
        };
        this.newpeoples.push(people);
      },
      deletenewpeople: function (id) {
        this.newpeoples = this.newpeoples.filter((x) => x.id != id);
      },
      checkaddpeople: function () {
        this.fncheckaddpeople(this);
      },
      orderCancel: function () {
        let segsA = this.segs.filter((x) => x.data.segStat == "待出票");
        if (this.segs.length == segsA.length) {
          let payload = {
            id: this.order.id,
            orderNo: this.order.data.orderNo,
          };
          layer.open({
            title: ["再次确认"],
            content: "确认要取消订单？",
            btn: ["确认", "取消"],
            shadeClose: true,
            yes: function (index, layero) {
              this.axios.post("/order/orderCancel", payload).then((rtn) => {
                console.log(rtn);
                layer.alert("订单已取消");
              });
            },
          });
        } else {
          msgError("只能取消待出票的订单", 2000);
        }
      },
      showView: function () {
        this.isShowViewLog = !this.isShowViewLog;
        if (this.isShowViewLog) {
          this.logs = this.order.logs;
        } else {
          this.logs = this.order.logs.filter((x) => x.ctg != "查看");
        }
      },
      rmkSave: function () {
        if (this.freeRmk) {
          let pl = {
            op: this.freeRmk,
            ctg: "备注",
            orderNo: this.order.orderno,
          };
          this.axios.post("/order/orderRmkManual", pl).then((rtn) => {
            if (rtn.data == 1) {
              this.logs.splice(0, 0, {
                oper: "me",
                op: pl.op,
                dat: new Date().Format("yyyy-MM-dd hh:mm"),
                ctg: "备注",
              });
              this.freeRmk = "";
            } else {
              alert("保存失败，请重试！");
            }
          });
        }
      },
      extraSave: function (extra) {
        extra.data.stat = "待处理";
        if (extra.data.pName == "") {
          let unHandled = this.segExtra.filter(
            (x) =>
            x.data.ctg == extra.data.ctg && x.data.stat == "待处理" && x.isCheck
          );
          unHandled.forEach((x) => {
            let data = x.data;
            if (extra.data.extraNo != "") data.extraNo = extra.data.extraNo;
            if (extra.data.item != "") data.item = extra.data.item;
            if (extra.data.rcvAcct != "") data.rcvAcct = extra.data.rcvAcct;
            if (extra.data.rcvTime != "") data.rcvTime = extra.data.rcvTime;
            if (extra.data.rcvOper != "") data.rcvOper = extra.data.rcvOper;
            if (extra.data.rcvSerial != "") data.rcvSerial = extra.data.rcvSerial;
            // data.pay = extra.data.pay;
            data.payAcct = extra.data.payAcct;
            data.payTime = extra.data.payTime;
            data.paySerial = extra.data.paySerial;
            data.payChannel = extra.data.payChannel;
            data.payOper = extra.data.payOper;
            data.email = "未发";
          });
          if (extra.data.rcv != "") this.cal(extra, unHandled, "rcv");
          if (extra.data.pay != "") this.cal(extra, unHandled, "pay");
          extra = unHandled;
        } else {
          if (
            extra.data.item == "" ||
            extra.data.rcvAcct == "" ||
            extra.data.rcvTime == ""
          ) {
            msgError("辅营项目、收款账号、收款时间为必填项！", 2000);
            return;
          }

          if (extra.data.payAcct != "" && extra.data.payTime == "") {
            msgError("请选择支付时间！", 2000);
            return;
          }
          extra.data.email = "未发";
          extra = [extra];
        }
        this.axios.post("/order/extraSave", extra).then((rtn) => {
          if (rtn.data > 0) {
            if (extra.id == 0) {
              extra.id = rtn.data;
            }
            layer.msg("保存成功！请刷新页面。", {
              icon: 1,
              offset: "t",
            });
            // window.location.reload();
          } else {
            alert("保存失败！请稍后再试。");
          }
        });
      },
      nameChngSave: function (psgr) {
        // console.log(psgr);
        if (
          psgr.data.rcv == "" ||
          psgr.data.rcvAcct == "" ||
          psgr.data.rcvTime == ""
        ) {
          msgError("实收金额、收款账号、收款日期都必填！");
          return;
        }
        if (psgr.data.rcvSerial != "") psgr.data.extraNo = psgr.data.rcvSerial;
        if (psgr.data.nation.length > 4) {
          msgError("国籍长度错误！");
          return;
        }

        this.axios.post("/order/nameChngSave", psgr).then((rtn) => {
          if (rtn.data > 0) {
            if (psgr.id == 0) {
              psgr.id = rtn.data;
            }
            layer.msg("保存成功！", {
              icon: 1,
              offset: "t",
            });
          } else {
            alert("保存失败！请稍后再试。");
          }
        });
      },
      extraBabySave: function (babyNew) {
        // if (babyNew.idType == '' || babyNew.idNo == '' || babyNew.idExpire == '') {
        //     msgError('证件信息为必填项！')
        //     return;
        // }
        if (babyNew.pName == "") {
          msgError("名字呢？");
          return;
        }
        if (!/\//.test(babyNew.pName)) {
          msgError("名字格式不对，需有斜杠‘/’");
          return;
        }
        if (this.extraBabyNew.extraNo == "" && this.extraBabyNew.rcvSerial != "")
          this.extraBabyNew.extraNo = this.extraBabyNew.rcvSerial;
        layer.load(2);
        this.axios
          .post("/order/extraBabyNewSave", this.extraBabyNew)
          .then((rtn) => {
            layer.close(layer.index);
            if (rtn.data > 0) {
              layer.msg("保存成功！", {
                icon: 1,
              });
            } else {
              alert("保存失败！请稍后再试。");
            }
          });
      },
      extraItemShow: function (extraItem) {
        this.extraItem = extraItem;
      },

      confirmTktIssue: function (pnrCode) {
        layer.confirm(
          "确认要提交出票？", {
            icon: 3,
            title: "确认",
          },
          function (index) {
            layer.close(index);
            if (ap.oper != ap.order.locker) {
              msgError("请先锁单！");
              return;
            }
            console.log(
              ap.order.data.pnrCode,
              ap.oper,
              ap.order.locker,
              ap.order.orderno
            );
            this.axios
              .post("/order/tktIssueApplyBypnrCode", {
                orderNo: ap.order.orderno,
                tktIssueChannel: "虎航B2B",
                tktIssueRmk: "",
                tktIssueCabin: "",
                tktIssueApplyRmk: "",
                tktIssueMail: "",
                pnrCode: ap.order.data.pnrCode,
              })
              .then((rtn) => {
                if (rtn.data.code == 0) {
                  msgOK("已经提交，请稍后查看出票结果");
                } else {
                  msgError(rtn.data.msg, 3 * 1000);
                }
              });
          }
        );
      },
      //zjj
      triptypechg: function () {
        var id = this.order.id;
        var typ = this.order.data.tripType;

        this.axios
          .post("/order/triptypechg", {
            id: id,
            typ: typ,
          })
          .then((rtn) => {
            if (rtn.data.code >= 0) {
              msgOK("修改成功");
            } else {
              msgError(rtn.data.msg);
            }
          });
      },
      getmatchs: function () {
        var orderno = this.order.data.orderNo;
        this.axios
          .post("/order/getmatchsforOrderno", {
            orderno: orderno,
          })
          .then((rtn) => {
            if (rtn) {
              ap.matchs = rtn.data;
            }
          });
      },
      dataGet(qry, app) {
        this.axios.get("/order/orderInfo/" + qry.orderNo).then((rtn) => {
          // rtn.segs.sort(by("timeDep", "data", 1, by("pName", "data", 1, "")));
          console.log(rtn.flightDepChng);
          console.log(rtn.data);
          //提取成人姓名 添加婴儿用
          app.adultNames = Array.from(
            new Set(
              rtn.segs
              .filter((s) => s.data.ageType == "成人")
              .map((s) => s.data.pName)
            )
          );

          //给添加婴儿对象的orderNo字段赋值
          app.extraBabyNew.orderNo = rtn.segs[0].data.orderNo;
          app.extraBabyNew.airCo = rtn.segs[0].data.airCo;
          app.extraBabyNew.route = rtn.segs[0].data.route;
          if (app.adultNames.length > 0) {
            app.extraBabyNew.parentName4Chd = app.adultNames[0];
          }

          app.segs = rtn.segs;
          if (
            app.configs.rcvAccts &&
            app.configs.rcvAccts.filter((x) => x.src == app.segs[0].src)
            .length > 0
          ) {
            app.configs.rcvAccts = app.configs.rcvAccts.filter(
              (x) => x.src == app.segs[0].src
            )[0].accts;
          }

          app.segs.forEach((x) => (x.isCheck = false));

          app.segs.map(function (x) {
            if (x.data.bag) {
              x.data.bag = (x.data.bag + "").replace("kg", "") + "kg";
            }
            if (x.data.bagPrice == 0) {
              x.data.bagPrice = "";
            }
            if (x.data.profitJp == 0) {
              x.data.profitJp = "";
            }
            if (x.data.profitExtra == 0) {
              x.data.profitExtra = "";
            }
            if (x.data.tktIssuePrice == 0) {
              x.data.tktIssuePrice = "";
            }
            if (x.data.tktIssuePriceFrn == 0) {
              x.data.tktIssuePriceFrn = "";
            }
            x.data.airCoYinShou = x.data.tktIssuePrice;
            x.data.psgrYinFu = parseFloat(x.data.price) + parseFloat(x.data.tax);

            //做个对比标识，将seg中的行程提取到routes中
            x.data.routeCompare = x.data.datDep + x.data.flightNo;
            if (
              app.routes.filter((r) => r.routeCompare == x.data.routeCompare)
              .length == 0
            ) {
              app.routes.push(x.data);
            }
            app.routes.forEach((x) => {
              if (x.price != "") x.price = new Number(x.price).toFixed(2);
              if (x.tax != "") x.tax = new Number(x.tax).toFixed(2);
            });
            if (["待出票", "出票完成", "改签中"].includes(x.data.segStat)) {
              ["行李", "餐食", "值机"].map(function (ctg) {
                if (
                  rtn.segExtra.filter(
                    (e) => e.segid == x.id && e.data.ctg == ctg
                  ).length == 0
                ) {
                  rtn.segExtra.push(
                    this.extraItemCreate(
                      x.id,
                      x.data.src,
                      x.data.airCo,
                      x.orderno,
                      x.data.route,
                      x.data.pName,
                      x.data.segStat,
                      ctg
                    )
                  );
                } else {
                  rtn.data.filter(
                    (e) => e.segid == x.id && e.data.ctg == ctg
                  )[0].data.segStat = x.data.segStat;
                }
              });
            }
          });

          app.segExtra = rtn.segExtra;

          app.segExtra.forEach((x) => (x.isCheck = false));

          app.oper = rtn.oper;

          rtn.order.logs.sort((x, y) => (x.dat > y.dat ? -1 : 1));

          rtn.order.data.rmkOld = rtn.order.data.rmk;
          rtn.id = rtn.id;
          app.order = rtn.order;

          app.logs = rtn.order.logs.filter((x) => x.ctg != "查看");

          if (app.segs.filter((x) => x.data.segStat === "已取消").length > 0) {
            layer.alert("有航段已取消");
          }

          app.chngsegs = rtn.data.segs;
          app.bags = rtn.data.bags;

          app.flightDepchng = rtn.data.flightDepChng;

          rtn.data.extra.sort((x, y) => (x.dat > y.dat ? -1 : 1));
          app.extra = rtn.data.extra;

          app.peoples = [];
          app.segs.map((seg) => {
            seg.data.gaiqiInfo = {
              timeDepOld: seg.data.timeDep,
              timeArrOld: seg.data.timeArr,
              flightNoOld: seg.data.flightNo,
              cabinOld: seg.data.cabin,
              priceOld: seg.data.price,
              taxOld: seg.data.tax,

              stat: "",

              rcv: "",
              rcvAcct: "",
              rcvTime: "",
              rcvOper: "",
              rcvSerial: "",
              pay: "",
              payAcct: "",
              payTime: "",
              payOper: "",
              paySerial: "",
              payChannel: "",
              airCoAR: "",
            };
            // seg.data.newoilFee = seg.data.oilFee;

            app.times.push({
              segid: seg.id,
              dep: seg.data.timeDep,
              arr: seg.data.timeArr,
            });

            let tmp = {
              id: 0,
              segid: seg.id,
              data: {
                orderNo: seg.orderno,
                pName: seg.data.pName,
                pNameOld: seg.data.pName,
                ageType: seg.data.ageType,
                ageTypeOld: seg.data.ageType,
                gender: seg.data.gender,
                genderOld: seg.data.gender,
                nation: seg.data.nation,
                nationOld: seg.data.nation,
                birthday: seg.data.birthday,
                birthdayOld: seg.data.birthday,
                idType: seg.data.idType,
                idTypeOld: seg.data.idType,
                idNo: seg.data.idNo,
                idNoOld: seg.data.idNo,
                idExpire: seg.data.idExpire,
                idExpireOld: seg.data.idExpire,

                src: seg.data.src,
                airCo: seg.data.airCo,
                route: seg.data.route,
                extraNo: "",

                ctg: "改名",
                stat: "待处理",
                segStat: seg.data.segStat,

                item: seg.data.pName,

                rcv: "",
                rcvAcct: "",
                rcvSerial: "",
                rcvTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                rcvOper: "",

                pay: "",
                payAcct: "",
                paySerial: "",
                payChannel: "",
                payTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                payOper: "",
              },
            };

            let his = rtn.data.segExtra.filter(
              (ext) => ext.data.ctg == "改名" && ext.data.pName == tmp.data.pName
            );
            if (his.length) {
              tmp.id = his.map((x) => x.id)[0];
              tmp.data.rcv = his[0].data.rcv;
              tmp.data.rcvAcct = his[0].data.rcvAcct;
              tmp.data.rcvSerial = his[0].data.rcvSerial;
              tmp.data.rcvTime = his[0].data.rcvTime;
              tmp.data.rcvOper = his[0].data.rcvOper;
              tmp.data.pay = his[0].data.pay;
              tmp.data.payAcct = his[0].data.payAcct;
              tmp.data.paySerial = his[0].data.paySerial;
              tmp.data.payChannel = his[0].data.payChannel;
              tmp.data.payTime = his[0].data.payTime;
              tmp.data.payOper = his[0].data.payOper;
            }
            if (
              app.peoples.filter((p) => p.data.pName == seg.data.pName).length == 0
            ) {
              app.peoples.push(tmp);
            }
          });
        });
      },
      getQualityTestingInfo(app) {
        let orderNo = this.qryobj(location.search).orderNo;
        let qry = {
          page: {
            idx: 1,
            cnt: 100,
          },
          orderId: orderNo,
        };
        this.axios
          .post("/order/qualityTestingList", qry)
          .then((res) => {
            let list = res.data.list;
            app.qualitytestinglist = list;
          })
          .catch((err) => {
            console.log(err);
          });
      },
      qryobj() {
        var theRequest = new Object();
        if (location.search.indexOf("?") != -1) {
          var str = location.search.substr(1);
          var strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
          }
        }
        return theRequest;
      },
      ///////////////////////////////////////////////////////////
      getQualityTestingInfo(app) {
        let orderNo = this.qryobj(location.search).orderNo;
        let qry = {
          page: {
            idx: 1,
            cnt: 100,
          },
          orderId: orderNo,
        };
        this.axios
          .post("/order/qualityTestingList", qry)
          .then((res) => {
            let list = res.data.list;
            app.qualitytestinglist = list;
          })
          .catch((err) => {
            console.log(err);
          });
      },
      applyQcard() {
        let data = {
          sumApply: Math.round(ap.extraItem.data.pay),
          orderNo: "fy" + (ap.extraItem.data.extraNo || ap.extraItem.data.orderNo),
          cur: "HKD",
        };
        this.axios.post("/fin/qCardApply", data).then((rtn) => {
          let cardInfo = rtn.data;
          if (rtn.data.errmsg) {
            alert(rtn.data.errmsg);
          } else {
            ap.extraItem.data.payAcct = "易商旅VCC";
            ap.extraItem.data.paySerial = cardInfo.VanNo;
            layer.open({
              title: "申卡成功",
              content: '<div id="card">卡号：' +
                cardInfo.VanNo +
                "<br><br>cvv：" +
                cardInfo.CVV +
                "<br><br>有效期：" +
                cardInfo.ExpiryDate.substring(0, 2) +
                "年" +
                cardInfo.ExpiryDate.substring(2) +
                "月 <br><br>持卡人： yang/qiaoqiao</div>",
              yes: function (index) {
                $("#test").click();
                layer.close(index);
              },
            });
          }
        });
      },

      pageRefesh() {
        window.location.href = window.location.href;
      },

      orderLockerChk() {
        setTimeout(orderLockerChk, 1000);
        if (ap.order.locker) {
          // console.log('lc');
        }
      },

      extraSave(extra) {
        this.axios.post("/order/extraSave", extra).then((rtn) => {
          if (rtn.data > 0) {
            if (extra.id == 0) {
              extra.id = rtn.data;
            }
            layer.msg("保存成功！", {
              icon: 1,
              offset: "t",
            });
          } else {
            alert("保存失败！请稍后再试。");
          }
        });
      },

      checkState(data) {
        if (data.length > 0) {
          let segStats = data.filter((x) => x.isCheck).map((x) => x.data.segStat);
          let states = Array.from(new Set(segStats));
          if (states.length > 1) {
            layer.alert("状态不一致不能批量操作!");
            return;
          }
          return states[0];
        }
      },

      extraItemCreate(
        segid,
        src,
        airCo,
        orderNo,
        route,
        pName,
        segStat,
        ctg
      ) {
        let r = {
          id: 0,
          segid: segid,
          // orderno: orderNo,
          // extrano: "",
          // ctg: ctg,
          // stat: "待处理",
          data: {
            src: src,
            airCo: airCo,
            route: route,
            orderNo: orderNo,
            pName: pName,
            extraNo: "",

            ctg: ctg,
            stat: "待处理",
            check: "待验真",
            checkRmk: "",
            segStat: segStat,

            item: "",

            rcv: "",
            rcvAcct: "",
            rcvTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            rcvOper: "",
            rcvSerial: "",
            pay: "",
            payAcct: "",
            payTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            payOper: "",
            paySerial: "",
            payChannel: "",
            isWithOrder: 0,
          },
        };
        return r;
      },

      // dataGet(qry, app) {
      //   // console.log(qry);
      //   this.axios.get("/order/orderInfo/" + qry.orderNo).then((rtn) => {
      //     // rtn.data.segs.sort((x, y) => x.data.datDep > y.data.datDep ? 1 : -1)
      //     rtn.data.segs.sort(by("timeDep", "data", 1, by("pName", "data", 1, "")));
      //     console.log(rtn.data.flightDepChng);
      //     console.log(rtn.data);
      //     //提取成人姓名 添加婴儿用
      //     app.adultNames = Array.from(
      //       new Set(
      //         rtn.data.segs
      //         .filter((s) => s.data.ageType == "成人")
      //         .map((s) => s.data.pName)
      //       )
      //     );

      //     //给添加婴儿对象的orderNo字段赋值
      //     app.extraBabyNew.orderNo = rtn.data.segs[0].data.orderNo;
      //     app.extraBabyNew.airCo = rtn.data.segs[0].data.airCo;
      //     app.extraBabyNew.route = rtn.data.segs[0].data.route;
      //     if (app.adultNames.length > 0) {
      //       app.extraBabyNew.parentName4Chd = app.adultNames[0];
      //     }

      //     app.segs = rtn.data.segs;
      //     if (
      //       app.configs.rcvAccts &&
      //       app.configs.rcvAccts.filter((x) => x.src == app.segs[0].data.src).length >
      //       0
      //     ) {
      //       app.configs.rcvAccts = app.configs.rcvAccts.filter(
      //         (x) => x.src == app.segs[0].data.src
      //       )[0].accts;
      //     }

      //     app.segs.forEach((x) => (x.isCheck = false));

      //     app.segs.map(function (x) {
      //       if (x.data.bag) {
      //         x.data.bag = (x.data.bag + "").replace("kg", "") + "kg";
      //       }
      //       if (x.data.bagPrice == 0) {
      //         x.data.bagPrice = "";
      //       }
      //       if (x.data.profitJp == 0) {
      //         x.data.profitJp = "";
      //       }
      //       if (x.data.profitExtra == 0) {
      //         x.data.profitExtra = "";
      //       }
      //       if (x.data.tktIssuePrice == 0) {
      //         x.data.tktIssuePrice = "";
      //       }
      //       if (x.data.tktIssuePriceFrn == 0) {
      //         x.data.tktIssuePriceFrn = "";
      //       }
      //       x.data.airCoYinShou = x.data.tktIssuePrice;
      //       x.data.psgrYinFu = parseFloat(x.data.price) + parseFloat(x.data.tax);

      //       //做个对比标识，将seg中的行程提取到routes中
      //       x.data.routeCompare = x.data.datDep + x.data.flightNo;
      //       if (
      //         app.routes.filter((r) => r.routeCompare == x.data.routeCompare)
      //         .length == 0
      //       ) {
      //         app.routes.push(x.data);
      //       }
      //       app.routes.forEach((x) => {
      //         if (x.price != "") x.price = new Number(x.price).toFixed(2);
      //         if (x.tax != "") x.tax = new Number(x.tax).toFixed(2);
      //       });
      //       if (["待出票", "出票完成", "改签中"].includes(x.data.segStat)) {
      //         ["行李", "餐食", "值机"].map(function (ctg) {
      //           if (
      //             rtn.data.segExtra.filter(
      //               (e) => e.segid == x.id && e.data.ctg == ctg
      //             ).length == 0
      //           ) {
      //             rtn.data.segExtra.push(
      //               this.extraItemCreate(
      //                 x.id,
      //                 x.data.src,
      //                 x.data.airCo,
      //                 x.orderno,
      //                 x.data.route,
      //                 x.data.pName,
      //                 x.data.segStat,
      //                 ctg
      //               )
      //             );
      //           } else {
      //             rtn.data.segExtra.filter(
      //               (e) => e.segid == x.id && e.data.ctg == ctg
      //             )[0].data.segStat = x.data.segStat;
      //           }
      //         });
      //       }
      //     });

      //     app.segExtra = rtn.data.segExtra;

      //     app.segExtra.forEach((x) => (x.isCheck = false));

      //     // rtn.data.routes.sort((x, y) => x.datDep > y.datDep ? 1 : -1)
      //     // //可能更换航班号
      //     // rtn.data.routes.filter(x => x.route == rtn.data.segs[0].data.route)[0].flightNo = rtn.data.segs[0].data.flightNo
      //     // if (rtn.data.routes.length > 1) {
      //     //     rtn.data.routes.filter(x => x.route == rtn.data.segs[rtn.data.segs.length - 1].data.route)[0].flightNo = rtn.data.segs[rtn.data.segs.length - 1].data.flightNo
      //     // }
      //     // app.routes = rtn.data.routes;

      //     app.oper = rtn.data.oper;

      //     rtn.data.order.logs.sort((x, y) => (x.dat > y.dat ? -1 : 1));

      //     rtn.data.order.data.rmkOld = rtn.data.order.data.rmk;
      //     rtn.data.order.data.id = rtn.data.order.id;
      //     app.order = rtn.data.order;

      //     app.logs = rtn.data.order.logs.filter((x) => x.ctg != "查看");

      //     if (app.segs.filter((x) => x.data.segStat === "已取消").length > 0) {
      //       layer.alert("有航段已取消");
      //     }

      //     app.chngsegs = rtn.data.segs;
      //     app.bags = rtn.data.bags;

      //     app.flightDepchng = rtn.data.flightDepChng;

      //     rtn.data.extra.sort((x, y) => (x.dat > y.dat ? -1 : 1));
      //     app.extra = rtn.data.extra;

      //     app.peoples = [];
      //     app.segs.map((seg) => {
      //       seg.data.gaiqiInfo = {
      //         timeDepOld: seg.data.timeDep,
      //         timeArrOld: seg.data.timeArr,
      //         flightNoOld: seg.data.flightNo,
      //         cabinOld: seg.data.cabin,
      //         priceOld: seg.data.price,
      //         taxOld: seg.data.tax,

      //         stat: "",

      //         rcv: "",
      //         rcvAcct: "",
      //         rcvTime: "",
      //         rcvOper: "",
      //         rcvSerial: "",
      //         pay: "",
      //         payAcct: "",
      //         payTime: "",
      //         payOper: "",
      //         paySerial: "",
      //         payChannel: "",
      //         airCoAR: "",
      //       };
      //       // seg.data.newoilFee = seg.data.oilFee;

      //       app.times.push({
      //         segid: seg.id,
      //         dep: seg.data.timeDep,
      //         arr: seg.data.timeArr,
      //       });

      //       let tmp = {
      //         id: 0,
      //         segid: seg.id,
      //         data: {
      //           orderNo: seg.orderno,
      //           pName: seg.data.pName,
      //           pNameOld: seg.data.pName,
      //           ageType: seg.data.ageType,
      //           ageTypeOld: seg.data.ageType,
      //           gender: seg.data.gender,
      //           genderOld: seg.data.gender,
      //           nation: seg.data.nation,
      //           nationOld: seg.data.nation,
      //           birthday: seg.data.birthday,
      //           birthdayOld: seg.data.birthday,
      //           idType: seg.data.idType,
      //           idTypeOld: seg.data.idType,
      //           idNo: seg.data.idNo,
      //           idNoOld: seg.data.idNo,
      //           idExpire: seg.data.idExpire,
      //           idExpireOld: seg.data.idExpire,

      //           src: seg.data.src,
      //           airCo: seg.data.airCo,
      //           route: seg.data.route,
      //           extraNo: "",

      //           ctg: "改名",
      //           stat: "待处理",
      //           segStat: seg.data.segStat,

      //           item: seg.data.pName,

      //           rcv: "",
      //           rcvAcct: "",
      //           rcvSerial: "",
      //           rcvTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
      //           rcvOper: "",

      //           pay: "",
      //           payAcct: "",
      //           paySerial: "",
      //           payChannel: "",
      //           payTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
      //           payOper: "",
      //         },
      //       };

      //       let his = rtn.data.segExtra.filter(
      //         (ext) => ext.data.ctg == "改名" && ext.data.pName == tmp.data.pName
      //       );
      //       if (his.length) {
      //         tmp.id = his.map((x) => x.id)[0];
      //         tmp.data.rcv = his[0].data.rcv;
      //         tmp.data.rcvAcct = his[0].data.rcvAcct;
      //         tmp.data.rcvSerial = his[0].data.rcvSerial;
      //         tmp.data.rcvTime = his[0].data.rcvTime;
      //         tmp.data.rcvOper = his[0].data.rcvOper;
      //         tmp.data.pay = his[0].data.pay;
      //         tmp.data.payAcct = his[0].data.payAcct;
      //         tmp.data.paySerial = his[0].data.paySerial;
      //         tmp.data.payChannel = his[0].data.payChannel;
      //         tmp.data.payTime = his[0].data.payTime;
      //         tmp.data.payOper = his[0].data.payOper;
      //       }

      //       // if (app.peoples.length == 0) {
      //       //     app.peoples.push(tmp);
      //       // } else {
      //       //     if (app.peoples.filter(x => x.pName == pName).length == 0) {
      //       //         app.peoples.push(tmp);
      //       //     } else {
      //       //         var t = app.peoples.filter(x => x.pName == pName)[0];
      //       //         t.segIds.push(seg.id);
      //       //     }
      //       // }
      //       if (
      //         app.peoples.filter((p) => p.data.pName == seg.data.pName).length == 0
      //       ) {
      //         app.peoples.push(tmp);
      //       }
      //     });
      //   });
      // },

      fncheckrefund(app) {
        let checkRefundInfo = "";
        app.segs
          .filter((x) => x.data.segStat == "待出票" || x.data.segStat == "出票完成")
          .map((item) => {
            if (
              item.isCheck &&
              item.data.refundType != "" &&
              item.data.airCoYinShou >= 0 &&
              item.data.psgrYinFu >= 0
            ) {
              item.canRefund = true;
              checkRefundInfo =
                checkRefundInfo +
                "乘客：" +
                item.data.pName +
                "  行程：" +
                item.data.route;
              if (item.data.tktNo != "") {
                checkRefundInfo = checkRefundInfo + "  票号：" + item.data.tktNo;
              }
              checkRefundInfo = checkRefundInfo + "</br>";
            } else {
              item.canRefund = false;
            }
          });
        var lock = false; //加个锁
        if (checkRefundInfo != "") {
          layer.open({
            title: ["提示"],
            content: '<div style="color:#767676">确认提交退票<br/><b>' +
              checkRefundInfo +
              "</b>吗?</div>",
            btn: ["确认", "取消"],
            shadeClose: true,
            //回调函数
            yes: function (index, layero) {
              //确认
              if (!lock) {
                lock = true;
                this.fnRefundSubmit(app);
              }
            },
            // btn2: function (index, layero) {//取消
            // },
            // cancel: function (index, layero) { //按右上角“X”按钮
            // },
          });
        } else {
          layer.alert("请先输入有效的退票信息!", {
            icon: 5,
          });
        }
      },

      fnRefundSubmit(app) {
        let data = app.segs.filter((x) => x.canRefund == true);
        console.log(data);
        this.axios.post("/order/saverefund", data).then((rtn) => {
          if (rtn.data.code == 0) {
            //app.segs = app.segs.filter(x => x.canRefund != true);
            app.segs
              .filter((x) => x.canRefund == true)
              .map((item) => {
                item.data.segStat = "申请退票";
              });
            layer.alert("提交成功!", {
              icon: 6,
            });
          } else {
            alert("提交失败!");
          }
        });
      },

      fnchngCheck(id, app) {
        let tchng = app.chngsegs.filter((x) => x.id == id)[0];
        let edittime = app.times.filter((x) => x.segid == id)[0];
        tchng.data.newtimeDep = edittime.dep;
        tchng.data.newtimeArr = edittime.arr;
        if (tchng.data.newflightNo == "") {
          layer.alert("请输入航班号!", {
            icon: 5,
          });
          return;
        }
        tchng.data.newflightNo = tchng.data.newflightNo.toUpperCase();
        if (tchng.data.newcabin == "") {
          layer.alert("请输入舱位!", {
            icon: 5,
          });
          return;
        }
        tchng.data.newcabin = tchng.data.newcabin.toUpperCase();
        if (tchng.data.newprice == "") {
          layer.alert("请输入票价!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newprice < 0) {
          layer.alert("请输入有效票价!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newtax == "") {
          layer.alert("请输入税费!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newtax < 0) {
          layer.alert("请输入有效税费!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newoilFee == "") {
          layer.alert("请输入燃油费!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newoilFee < 0) {
          layer.alert("请输入有效燃油费!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.feeGaiQi == undefined || tchng.data.feeGaiQi == "") {
          layer.alert("请输入改签费!", {
            icon: 5,
          });
          return;
        }

        if (tchng.data.feeGaiQi < 0) {
          layer.alert("请输入有效的改签费!", {
            icon: 5,
          });
          return;
        }

        if (tchng.data.feeShenCang == undefined || tchng.data.feeShenCang == "") {
          layer.alert("请输入升舱费!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.feeShenCang < 0) {
          layer.alert("请输入有效的升舱费!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.shishouacct == "") {
          layer.alert("请选择实收客人款账号!", {
            icon: 5,
          });
          return;
        }

        if (tchng.data.shishouserial == undefined) {
          tchng.data.shishouserial = "";
        }
        var info = "";
        if (
          !(tchng.data.chngjpfundids == undefined || tchng.data.chngjpfundids == "")
        ) {
          info =
            "此次为当前数据第" +
            (tchng.data.chngjpfundids.length + 1) +
            "次改签!<br/>";
        }

        var lock = false; //加个锁
        layer.open({
          title: ["提示"],
          content: '<div style="color:#767676">' + info + "确认提交改签数据?</div>",
          btn: ["确认", "取消"],
          shadeClose: true,
          //回调函数
          yes: function (index, layero) {
            //确认
            if (!lock) {
              lock = true;
              this.fnTchngSubmit(id, app);
            }
          },
          // btn2: function (index, layero) {//取消
          // },
          // cancel: function (index, layero) { //按右上角“X”按钮
          // },
        });
      },

      fnTchngSubmit(id, app) {
        let tchng = app.chngsegs.filter((x) => x.id == id)[0];

        this.axios.post("/order/savechng", tchng).then((rtn) => {
          if (rtn.data.code == 0) {
            app.chngsegs = app.chngsegs.filter((x) => x.id != id);

            layer.alert("确认改签成功!", {
              icon: 6,
              // yes: function () {
              //     layer.closeAll();
              // }
            });
          } else {
            layer.alert("确认改签失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      fnyuantchngCheck(id, app) {
        let tchng = app.chngsegs.filter((x) => x.id == id)[0];
        if (tchng.data.newflightNo == "") {
          layer.alert("请输入航班号!", {
            icon: 5,
          });
          return;
        }
        tchng.data.newflightNo = tchng.data.newflightNo.toUpperCase();
        if (tchng.data.newcabin == "") {
          layer.alert("请输入舱位!", {
            icon: 5,
          });
          return;
        }
        tchng.data.newcabin = tchng.data.newcabin.toUpperCase();
        if (tchng.data.newprice == "") {
          layer.alert("请输入票价!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newprice < 0) {
          layer.alert("请输入有效票价!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newtax == "") {
          tchng.data.newtax = 0;
        }
        if (tchng.data.newtax < 0) {
          layer.alert("请输入有效税费!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newoilFee == "") {
          tchng.data.newoilFee = 0;
        }
        if (tchng.data.newoilFee < 0) {
          layer.alert("请输入有效燃油费!", {
            icon: 5,
          });
          return;
        }
        var info = "";
        //alert(tchng.data.shishouacct)
        //return;
        if (tchng.data.shishouacct != "" && tchng.data.shishouacct != undefined) {
          if (tchng.data.feeGaiQi == undefined || tchng.data.feeGaiQi == "") {
            layer.alert("请输入改签费!", {
              icon: 5,
            });
            return;
          }

          if (tchng.data.feeGaiQi < 0) {
            layer.alert("请输入有效的改签费!", {
              icon: 5,
            });
            return;
          }

          if (tchng.data.feeShenCang == undefined || tchng.data.feeShenCang == "") {
            layer.alert("请输入升舱费!", {
              icon: 5,
            });
            return;
          }
          if (tchng.data.feeShenCang < 0) {
            layer.alert("请输入有效的升舱费!", {
              icon: 5,
            });
            return;
          }
          if (tchng.data.shishouserial == undefined) {
            tchng.data.shishouserial = "";
          }
        } else {
          info = "未录入实收客人费用!<br/>";
          tchng.data.shishouacct = "";
        }
        if (tchng.data.shifu == "" || tchng.data.shifu == undefined) {
          layer.alert("请输入实付金额!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.shifu < 0) {
          layer.alert("请输入有效实付金额!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.shifuacct == "" || tchng.data.shifuacct == undefined) {
          layer.alert("请选择实付账号!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.shifuserial == undefined) {
          tchng.data.shifuserial = "";
        }

        if (
          !(tchng.data.chngjpfundids == undefined || tchng.data.chngjpfundids == "")
        ) {
          info =
            info +
            "此次为当前数据第" +
            (tchng.data.chngjpfundids.length + 1) +
            "次改签!<br/>";
        }
        var lock = false; //加个锁
        layer.open({
          title: ["提示"],
          content: '<div style="color:#767676">' + info + "确认提交原票改签数据?</div>",
          btn: ["确认", "取消"],
          shadeClose: true,
          //回调函数
          yes: function (index, layero) {
            //确认
            if (!lock) {
              lock = true;
              this.fnTchngYuanSubmit(id, app);
            }
          },
          // btn2: function (index, layero) {//取消
          // },
          // cancel: function (index, layero) { //按右上角“X”按钮
          // },
        });
      },

      fnTchngYuanSubmit(id, app) {
        let tchng = app.chngsegs.filter((x) => x.id == id)[0];
        this.axios.post("/order/saveyuanchng", tchng).then((rtn) => {
          if (rtn.data.code == 0) {
            app.chngsegs = app.chngsegs.filter((x) => x.id != id);

            layer.alert("确认原票改签成功!", {
              icon: 6,
              // yes: function () {
              //     layer.closeAll();
              // }
            });
          } else {
            layer.alert("确认原票改签失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      fnreoutchngCheck(id, app) {
        let tchng = app.chngsegs.filter((x) => x.id == id)[0];
        if (tchng.data.newflightNo == "") {
          layer.alert("请输入航班号!", {
            icon: 5,
          });
          return;
        }
        tchng.data.newflightNo = tchng.data.newflightNo.toUpperCase();
        if (tchng.data.newcabin == "") {
          layer.alert("请输入舱位!", {
            icon: 5,
          });
          return;
        }
        tchng.data.newcabin = tchng.data.newcabin.toUpperCase();
        if (tchng.data.newprice == "") {
          layer.alert("请输入票价!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newprice < 0) {
          layer.alert("请输入有效票价!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newtax == "") {
          tchng.data.newtax = 0;
        }
        if (tchng.data.newtax < 0) {
          layer.alert("请输入有效税费!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.newoilFee == "") {
          tchng.data.newoilFee = 0;
        }
        if (tchng.data.newoilFee < 0) {
          layer.alert("请输入有效燃油费!", {
            icon: 5,
          });
          return;
        }
        var info = "";
        if (tchng.data.shishouacct != "" && tchng.data.shishouacct != undefined) {
          if (tchng.data.feeGaiQi == undefined || tchng.data.feeGaiQi == "") {
            layer.alert("请输入改签费!", {
              icon: 5,
            });
            return;
          }

          if (tchng.data.feeGaiQi < 0) {
            layer.alert("请输入有效的改签费!", {
              icon: 5,
            });
            return;
          }

          if (tchng.data.feeShenCang == undefined || tchng.data.feeShenCang == "") {
            layer.alert("请输入升舱费!", {
              icon: 5,
            });
            return;
          }
          if (tchng.data.feeShenCang < 0) {
            layer.alert("请输入有效的升舱费!", {
              icon: 5,
            });
            return;
          }
          if (tchng.data.shishouserial == undefined) {
            tchng.data.shishouserial = "";
          }
        } else {
          info = "未录入实收客人费用!<br/>";
          tchng.data.shishouacct = "";
        }
        if (tchng.data.yingtui == "" || tchng.data.yingtui == undefined) {
          layer.alert("请输入航司应退!", {
            icon: 5,
          });
          return;
        }
        if (tchng.data.yingtui < 0) {
          layer.alert("请输入有效航司应退金额!", {
            icon: 5,
          });
          return;
        }
        if (
          !(tchng.data.chngjpfundids == undefined || tchng.data.chngjpfundids == "")
        ) {
          info =
            info +
            "此次为当前数据第" +
            (tchng.data.chngjpfundids.length + 1) +
            "次改签!<br/>";
        }
        var lock = false; //加个锁
        layer.open({
          title: ["提示"],
          content: '<div style="color:#767676">' + info + "确认提交重出改签数据?</div>",
          btn: ["确认", "取消"],
          shadeClose: true,
          //回调函数
          yes: function (index, layero) {
            //确认
            if (!lock) {
              lock = true;
              this.fnReoutTchngSubmit(id, app);
            }
          },
          // btn2: function (index, layero) {//取消
          // },
          // cancel: function (index, layero) { //按右上角“X”按钮
          // },
        });
      },

      fnReoutTchngSubmit(id, app) {
        let tchng = app.chngsegs.filter((x) => x.id == id)[0];
        this.axios.post("/order/savereoutchng", tchng).then((rtn) => {
          if (rtn.data.code == 0) {
            app.chngsegs = app.chngsegs.filter((x) => x.id != id);

            layer.alert("确认重出改签成功!", {
              icon: 6,
            });
          } else {
            layer.alert("确认重出改签失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      fnRevokeChngCheck(id, app) {
        let item = app.segs.filter((x) => x.id == id)[0];
        lock = false; //加个锁
        layer.open({
          title: ["提示"],
          content: '<div style="color:#767676">确认撤销：' +
            "<p/>行程：" +
            item.data.route +
            "<p/>姓名：" +
            item.data.pName +
            "<p/>起飞时间：" +
            item.data.timeDep +
            "<p/>的改签申请吗?</div>",
          btn: ["确认", "取消"],
          shadeClose: true,
          //回调函数
          yes: function (index, layero) {
            //确认
            if (!lock) {
              lock = true;
              this.fnRevokeChngSubmit(id, app);
            }
          },
          // btn2: function (index, layero) {//取消
          // },
          // cancel: function (index, layero) { //按右上角“X”按钮
          // },
        });
      },

      fnRevokeChngSubmit(id, app) {
        let seg = app.segs.filter((x) => x.id == id)[0];
        this.axios.post("/order/revokechng", seg).then((rtn) => {
          if (rtn.data.code == 0) {
            // reloadorder(location.search.qryobj(), app);
            this.dataGet(this.qryobj(location.search), app);
            layer.alert("撤销改签成功!", {
              icon: 6,
            });
          } else {
            layer.alert("撤销改签失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      reloadorder(qry, app) {
        axios.get('/api/order/orderInforeload/' + qry.orderNo).then(rtn => {
          rtn.data.order.logs.sort((x, y) => x.dat > y.dat ? -1 : 1)
          app.order = rtn.data.order;
          rtn.data.routes.sort((x, y) => x.datDep > y.datDep ? 1 : -1)
          app.routes = rtn.data.routes;

          rtn.data.segs.sort((x, y) => x.data.datDep > y.data.datDep ? 1 : -1)
          app.segs = rtn.data.segs;
          app.chngsegs = rtn.data.segs;
          app.bags = rtn.data.bags;

          rtn.data.extra.sort((x, y) => x.dat > y.dat ? -1 : 1)
          app.extra = rtn.data.extra;
          app.peoples = [];
          app.segs.map(item => {
            item.data.newtimeDep = item.data.timeDep;
            item.data.newtimeArr = item.data.timeArr;
            item.data.newflightNo = item.data.flightNo;
            item.data.newcabin = item.data.cabin;
            item.data.newprice = item.data.price;
            item.data.newtax = item.data.tax;
            item.data.newoilFee = item.data.oilFee;

            app.times.push({
              "segid": item.id,
              "dep": item.data.timeDep,
              "arr": item.data.timeArr
            });

            var orderno = item.orderno;
            var pName = item.data.pName;
            var idType = item.data.idType;
            var idNo = item.data.idNo;
            var idExpire = item.data.idExpire; //证件到期日
            var tmp = {
              "orderno": orderno,
              "pName": pName,
              "pNameNew": pName,
              "idType": idType,
              "idTypeNew": idType,
              "idNo": idNo,
              "idNoNew": idNo,
              "idExpire": idExpire,
              "idExpireNew": idExpire,
              "segIds": [item.id]
            };
            if (app.peoples.length == 0) {
              app.peoples.push(tmp);
            } else {
              if (app.peoples.filter(x => x.pName == pName).length == 0) {
                app.peoples.push(tmp);
              } else {
                var t = app.peoples.filter(x => x.pName == pName)[0];
                t.segIds.push(item.id);
              }
            }
          });
        })
      },

      fncheckbag(id, app) {
        let editbag = app.segs.filter((x) => x.id == id)[0];
        if (editbag.data.bagtmp == undefined || editbag.data.bagtmp == "") {
          layer.alert("请输入重量!", {
            icon: 5,
          });
          return;
        }
        if (editbag.data.bagtmp <= 0) {
          layer.alert("请输入有效的重量!", {
            icon: 5,
          });
          return;
        }

        if (editbag.data.bagPrice == undefined || editbag.data.bagPrice == "") {
          layer.alert("请输入实收!", {
            icon: 5,
          });
          return;
        }
        if (editbag.data.bagPrice <= 0) {
          layer.alert("请输入有效的实收!", {
            icon: 5,
          });
          return;
        }
        if (
          editbag.data.bagshishouacct == "" ||
          editbag.data.bagshishouacct == undefined
        ) {
          layer.alert("请选择实收账号!", {
            icon: 5,
          });
          return;
        }
        var shifuinfo = "";
        if (editbag.data.tktNo != "") {
          if (editbag.data.bagshifu == undefined || editbag.data.bagshifu == "") {
            layer.alert("请输入实付!", {
              icon: 5,
            });
            return;
          }
          if (editbag.data.bagshifu < 0) {
            layer.alert("请输入有效的实付!", {
              icon: 5,
            });
            return;
          }
          if (
            editbag.data.bagshifuacct == "" ||
            editbag.data.bagshifuacct == undefined
          ) {
            layer.alert("请选择实付账号!", {
              icon: 5,
            });
            return;
          }
          shifuinfo =
            shifuinfo +
            "<p/>实付：" +
            editbag.data.bagshifu +
            "<p/>实付账号：" +
            editbag.data.bagshifuacct +
            "<p/>实付流水：" +
            editbag.data.bagshifuserial;
        }

        lock = false; //加个锁
        layer.open({
          title: ["提示"],
          content: '<div style="color:#767676">确认添加行李：' +
            "<p/>重量：" +
            editbag.data.bagtmp +
            "<p/>实收：" +
            editbag.data.bagPrice +
            "<p/>实收账号：" +
            editbag.data.bagshishouacct +
            "<p/>实收流水：" +
            editbag.data.bagshishouserial +
            shifuinfo +
            "<p/>吗?</div>",
          btn: ["确认", "取消"],
          shadeClose: true,
          //回调函数
          yes: function (index, layero) {
            //确认
            if (!lock) {
              lock = true;
              this.fnBagSubmit(id, app);
            }
          },
          // btn2: function (index, layero) {//取消
          // },
          // cancel: function (index, layero) { //按右上角“X”按钮
          // },
        });
      },

      fnBagSubmit(id, app) {
        let segbag = app.segs.filter((x) => x.id == id)[0];
        this.axios.post("/order/savebag", segbag).then((rtn) => {
          if (rtn.data.code == 0) {
            segbag.data.bag = segbag.data.bagtmp;
            layer.alert("添加行李成功!", {
              icon: 6,
            });
          } else {
            layer.alert("添加行李失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      fncheckmeal(id, app) {
        let editmeal = app.segs.filter((x) => x.id == id)[0];
        if (editmeal.data.mealtmp == undefined || editmeal.data.mealtmp == "") {
          layer.alert("请输入餐食!", {
            icon: 5,
          });
          return;
        }

        if (editmeal.data.mealPrice == undefined || editmeal.data.mealPrice == "") {
          layer.alert("请输入实收!", {
            icon: 5,
          });
          return;
        }
        if (editmeal.data.mealPrice <= 0) {
          layer.alert("请输入有效的实收!", {
            icon: 5,
          });
          return;
        }
        if (
          editmeal.data.mealshishouacct == "" ||
          editmeal.data.mealshishouacct == undefined
        ) {
          layer.alert("请选择实收账号!", {
            icon: 5,
          });
          return;
        }
        var shifuinfo = "";
        if (editmeal.data.tktNo != "") {
          if (editmeal.data.mealshifu == undefined || editmeal.data.mealshifu == "") {
            layer.alert("请输入实付!", {
              icon: 5,
            });
            return;
          }
          if (editmeal.data.mealshifu < 0) {
            layer.alert("请输入有效的实付!", {
              icon: 5,
            });
            return;
          }
          if (
            editmeal.data.mealshifuacct == "" ||
            editmeal.data.mealshifuacct == undefined
          ) {
            layer.alert("请选择实付账号!", {
              icon: 5,
            });
            return;
          }
          shifuinfo =
            shifuinfo +
            "<p/>实付：" +
            editmeal.data.mealshifu +
            "<p/>实付账号：" +
            editmeal.data.mealshifuacct +
            "<p/>实付流水：" +
            editmeal.data.mealshifuserial;
        }

        lock = false; //加个锁
        layer.open({
          title: ["提示"],
          content: '<div style="color:#767676">确认添加：' +
            "<p/>餐食：" +
            editmeal.data.mealtmp +
            "<p/>实收：" +
            editmeal.data.mealPrice +
            "<p/>实收账号：" +
            editmeal.data.mealshishouacct +
            "<p/>实收流水：" +
            editmeal.data.mealshishouserial +
            shifuinfo +
            "<p/>吗?</div>",
          btn: ["确认", "取消"],
          shadeClose: true,
          //回调函数
          yes: function (index, layero) {
            //确认
            if (!lock) {
              lock = true;
              this.fnMealSubmit(id, app);
            }
          },
        });
      },

      fnMealSubmit(id, app) {
        let meal = app.segs.filter((x) => x.id == id)[0];
        this.axios.post("/order/savemeal", meal).then((rtn) => {
          if (rtn.data.code == 0) {
            meal.data.meal = meal.data.mealtmp;
            layer.alert("添加餐食成功!", {
              icon: 6,
            });
          } else {
            layer.alert("添加餐食失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      fncheckseat(id, app) {
        let edit = app.segs.filter((x) => x.id == id)[0];
        if (edit.data.seattmp == undefined || edit.data.seattmp == "") {
          layer.alert("请输入值机!", {
            icon: 5,
          });
          return;
        }

        if (edit.data.seatPrice == undefined || edit.data.seatPrice == "") {
          layer.alert("请输入实收!", {
            icon: 5,
          });
          return;
        }
        if (edit.data.seatPrice <= 0) {
          layer.alert("请输入有效的实收!", {
            icon: 5,
          });
          return;
        }
        if (
          edit.data.seatshishouacct == "" ||
          edit.data.seatshishouacct == undefined
        ) {
          layer.alert("请选择实收账号!", {
            icon: 5,
          });
          return;
        }
        var shifuinfo = "";
        if (edit.data.tktNo != "") {
          if (edit.data.seatshifu == undefined || edit.data.seatshifu == "") {
            layer.alert("请输入实付!", {
              icon: 5,
            });
            return;
          }
          if (edit.data.seatshifu < 0) {
            layer.alert("请输入有效的实付!", {
              icon: 5,
            });
            return;
          }
          if (edit.data.seatshifuacct == "" || edit.data.seatshifuacct == undefined) {
            layer.alert("请选择实付账号!", {
              icon: 5,
            });
            return;
          }
          shifuinfo =
            shifuinfo +
            "<p/>实付：" +
            edit.data.seatshifu +
            "<p/>实付账号：" +
            edit.data.seatshifuacct +
            "<p/>实付流水：" +
            edit.data.seatshifuserial;
        }

        lock = false; //加个锁
        layer.open({
          title: ["提示"],
          content: '<div style="color:#767676">确认添加：' +
            "<p/>值机：" +
            edit.data.seattmp +
            "<p/>实收：" +
            edit.data.seatPrice +
            "<p/>实收账号：" +
            edit.data.seatshishouacct +
            "<p/>实收流水：" +
            edit.data.seatshishouserial +
            shifuinfo +
            "<p/>吗?</div>",
          btn: ["确认", "取消"],
          shadeClose: true,
          //回调函数
          yes: function (index, layero) {
            //确认
            if (!lock) {
              lock = true;
              this.fnSeatSubmit(id, app);
            }
          },
        });
      },

      fnSeatSubmit(id, app) {
        let seat = app.segs.filter((x) => x.id == id)[0];
        this.axios.post("/order/saveseat", seat).then((rtn) => {
          if (rtn.data.code == 0) {
            seat.data.seat = seat.data.seattmp;
            layer.alert("添加值机成功!", {
              icon: 6,
            });
          } else {
            layer.alert("添加值机失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      fncheckpeopleshishou(pname, app) {
        let people = app.peoples.filter((x) => x.pName == pname)[0];
        // var tmp = {
        //     "orderno": orderno,
        //     "pName": pName,
        //     "pNameNew": pName,
        //     "idType": idType,
        //     "idTypeNew": idType,
        //     "idNo": idNo,
        //     "idNoNew": idNo,
        //     "idExpire": idExpire,
        //     "idExpireNew": idExpire,
        // };
        if (people.pNameNew.trim() == "") {
          layer.alert("请输入乘客姓名!", {
            icon: 5,
          });
          return;
        }
        if (people.idTypeNew == "") {
          layer.alert("请选择证件类型!", {
            icon: 5,
          });
          return;
        }
        if (people.idNoNew.trim() == "") {
          layer.alert("请输入证件号!", {
            icon: 5,
          });
          return;
        }

        if (people.idExpireNew == "" || people.idExpireNew == null) {
          layer.alert("请输入证件到期日!", {
            icon: 5,
          });
          return;
        }
        if (
          people.pName != people.pNameNew ||
          people.idType != people.idTypeNew ||
          people.idNo != people.idNoNew ||
          people.idExpire != people.idExpireNew
        ) {
          var updateinfo = "";
          if (people.shishou == undefined || people.shishou == "") {
            layer.alert("请输入实收!", {
              icon: 5,
            });
            return;
          }
          if (people.shishou < 0) {
            layer.alert("请输入有效的实收!", {
              icon: 5,
            });
            return;
          }
          if (people.shishouacct == "" || people.shishouacct == undefined) {
            layer.alert("请选择实收账号!", {
              icon: 5,
            });
            return;
          }
          if (people.pName != people.pNameNew) {
            updateinfo =
              updateinfo + "<p/>姓名:" + people.pName + " >> " + people.pNameNew;
          }
          if (people.idType != people.idTypeNew) {
            updateinfo =
              updateinfo +
              "<p/>证件类型:" +
              people.idType +
              " >> " +
              people.idTypeNew;
          }
          if (people.idNo != people.idNoNew) {
            updateinfo =
              updateinfo + "<p/>证件号:" + people.idNo + " >> " + people.idNoNew;
          }
          if (people.idExpire != people.idExpireNew) {
            updateinfo =
              updateinfo +
              "<p/>证件到日期:" +
              people.idExpire +
              " >> " +
              people.idExpireNew;
          }

          lock = false; //加个锁
          layer.open({
            title: ["提示"],
            content: '<div style="color:#767676">确认修改乘客信息：' +
              updateinfo +
              "<p/>实收：" +
              people.shishou +
              "<p/>实收账号：" +
              people.shishouacct +
              "<p/>实收流水：" +
              people.shishouserial +
              "<p/>吗?</div>",
            btn: ["确认", "取消"],
            shadeClose: true,
            //回调函数
            yes: function (index, layero) {
              //确认
              if (!lock) {
                lock = true;
                this.fnPeopleShiShouSubmit(pname, app);
              }
            },
          });
        } else {
          layer.alert("乘客信息没有进行修改,不需要保存!", {
            icon: 5,
          });
        }
      },

      fnPeopleShiShouSubmit(pname, app) {
        let people = app.peoples.filter((x) => x.pName == pname)[0];
        this.axios.post("/order/updatepeopleshishou", people).then((rtn) => {
          if (rtn.data.code == 0) {
            people.pName = people.pNameNew;
            people.idType = people.idTypeNew;
            people.idNo = people.idNoNew;
            people.idExpire = people.idExpireNew;
            layer.alert("改名添加实收成功!", {
              icon: 6,
            });
          } else {
            layer.alert("改名失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      fncheckpeopleshifu(pname, app) {
        let people = app.peoples.filter((x) => x.pName == pname)[0];

        if (people.shifu == undefined || people.shifu == "") {
          layer.alert("请输入实付!", {
            icon: 5,
          });
          return;
        }
        if (people.shifu < 0) {
          layer.alert("请输入有效的实付!", {
            icon: 5,
          });
          return;
        }
        if (people.shifuacct == "" || people.shifuacct == undefined) {
          layer.alert("请选择实付账号!", {
            icon: 5,
          });
          return;
        }

        lock = false; //加个锁
        layer.open({
          title: ["提示"],
          content: '<div style="color:#767676">确认添加改名实付信息：' +
            "<p/>实付：" +
            people.shifu +
            "<p/>实付账号：" +
            people.shifuacct +
            "<p/>实付流水：" +
            people.shifuserial +
            "<p/>吗?</div>",
          btn: ["确认", "取消"],
          shadeClose: true,
          //回调函数
          yes: function (index, layero) {
            //确认
            if (!lock) {
              lock = true;
              this.fnPeopleShiFuSubmit(pname, app);
            }
          },
        });
      },

      fnPeopleShiFuSubmit(pname, app) {
        let people = app.peoples.filter((x) => x.pName == pname)[0];
        this.axios.post("/order/updatepeopleshifu", people).then((rtn) => {
          if (rtn.data.code == 0) {
            layer.alert("添加改名实付成功!", {
              icon: 6,
            });
          } else {
            layer.alert("添加改名实付失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      fncheckaddpeople(app) {
        var addpeoples = app.newpeoples;

        let checkInfo = "";
        var names = "";
        //pName  birthday gender  price  tax shishou shishouacct  shishouserial  shifu  shifuacct  shifuserial
        for (var i = 0; i < addpeoples.length; i++) {
          var people = addpeoples[i];
          if (
            people.pName == undefined ||
            people.pName.trim() == "" ||
            people.birthday == undefined ||
            people.birthday == "" ||
            people.gender == undefined ||
            people.gender == "" ||
            people.price == undefined ||
            people.price == "" ||
            people.tax == undefined ||
            people.tax == "" ||
            people.shishou == undefined ||
            people.shishou == "" ||
            people.shishouacct == undefined ||
            people.shishouacct == "" ||
            people.shifu == undefined ||
            people.shifu == "" ||
            people.shifuacct == undefined ||
            people.shifuacct == ""
          ) {
            checkInfo = checkInfo + " 第" + (i + 1) + "行数据录入不完整<br/>";
            continue;
          } else {
            if (people.price < 0) {
              checkInfo = checkInfo + " 第" + (i + 1) + "行数据未录入有效的价格<br/>";
              continue;
            }
            if (people.tax < 0) {
              checkInfo = checkInfo + " 第" + (i + 1) + "行数据未录入有效的税<br/>";
              continue;
            }
            if (people.shishou < 0) {
              checkInfo = checkInfo + " 第" + (i + 1) + "行数据未录入有效的实收<br/>";
              continue;
            }
            if (people.shifu < 0) {
              checkInfo = checkInfo + " 第" + (i + 1) + "行数据未录入有效的实付<br/>";
              continue;
            }
            if (people.shishouserial == undefined) {
              people.shishouserial = "";
            }
            if (people.shifu == undefined) {
              people.shifu = "";
            }
            names = names + people.pName + ",";
          }
        }
        if (checkInfo != "") {
          layer.alert(checkInfo, {
            icon: 5,
          });
          return;
        }
        names = names.substring(0, names.length - 1);
        var lock = false; //加个锁
        layer.open({
          title: ["提示"],
          content: '<div style="color:#767676">确认添加<b>[' + names + "]</b>吗?</div>",
          btn: ["确认", "取消"],
          shadeClose: true,
          //回调函数
          yes: function (index, layero) {
            //确认
            if (!lock) {
              lock = true;
              this.fnAddPeoplesSubmit(app);
            }
          },
          // btn2: function (index, layero) {//取消
          // },
          // cancel: function (index, layero) { //按右上角“X”按钮
          // },
        });
      },

      fnAddPeoplesSubmit(app) {
        var addpeoples = app.newpeoples;
        this.axios.post("/order/addnewpeoples", addpeoples).then((rtn) => {
          if (rtn.data.code == 0) {
            layer.alert("添加婴儿成功!", {
              icon: 6,
            });
            app.newpeoples = [];
          } else {
            layer.alert("添加婴儿失败!" + rtn.data.msg, {
              icon: 5,
            });
          }
        });
      },

      fakePNRGen() {
        let pnr = Math.random()
          .toString(36)
          .substr(2)
          .toUpperCase()
          .substr(0, 6);
        let pattern = /^[A-Z][0-9A-Z]+/i;
        for (let i = 0; i < 100; i++) {
          pnr = Math.random()
            .toString(36)
            .substr(2)
            .toUpperCase()
            .substr(0, 6);
          if (pattern.test(pnr)) {
            break;
          }
        }
        return pnr;
      },


      cal(item, data, val) {
        let tmp = 0;
        for (let i = 0; i < data.length; i++) {
          let totalRcv = item.data[val];
          if (i + 1 < data.length) {
            data[i].data[val] = (totalRcv / data.length).toFixed(2);
            tmp = tmp + parseFloat((totalRcv / data.length).toFixed(2));
          } else {
            data[i].data[val] = totalRcv - tmp
          }
        }
      }


    },


  };
</script>
<style scope>
.mytable {
  /* border: 1px solid #999; */
  /* margin: 0px 5px; */
  /* border-collapse: collapse; */
  /* border-top: solid 2px rgb(210, 221, 252); */
  width: 100%;
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

.triangle_border_nw {
  width: 0;
  height: 0;
  border-width: 20px 20px 20px 20px;
  border-style: solid;
  border-color: transparent transparent red red;
}

.triangle {
  width: 0;
  height: 0;
  border-width: 20px 0px 0px 20px;
  border-style: solid;
  border-color: blue yellow red red;
}

.infolabel {
  background-color: rgb(210, 221, 252);
  margin: 0 5px;
  padding: 2px 15px;
  display: inline-block;
  border-radius: 1px 10px 0px 0px;
}

.labeldiv {
  margin-top: 5px;
  border-bottom: solid 2px rgb(210, 221, 252);
}

.red {
  color: red;
}

.infoOrder,
.infoRoute {
  width: 1100px;
}

.small {
  font-size: 7px;
  color: #aaaaaa;
  padding: 0px;
  margin: 0px;
}

.extraType {
  list-style: none;
  height: 33px;
  margin: 0px;
  padding: 0px;
  border-bottom: solid 2px #aaaaff;
  width: 500px;
}

.extraType li {
  float: left;
  margin: 0px 5px 0px 10px;
  padding: 5px 20px;
  border: solid 1px #aaaaff;
  border-radius: 0px 5px 0px 0px;
}

.tbl {
  border: solid 1px gray;
}

.tbl thead tr {
  background-color: #e2e2fa;
}

.tbl thead td {
  /* text-align: center; */
  /* padding: 6px; */
}

.tbl td {
  padding: 3px 3px;
}

.tbl tbody tr:hover {
  background-color: #d7ddfa;
}

.sbtn {
  color: steelblue;
  cursor: pointer;
}

.extrarmk {
  margin: 10px;
}

.extrarmk li {
  margin: 10px;
}

.logCol1 {
  width: 160px;
  white-space: nowrap;
}

.eltag {
  margin-top: 5px;
  cursor: pointer;
}

.el-upload__input {
  display: none !important;
}
</style>
