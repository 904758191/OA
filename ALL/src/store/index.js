import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
  },
  state: {
    datasrc: '', // 政策管理平台信息存储
    tablesrc: '', // 分库信息存储
    searched_path: {},
    // 精细化调价
    error: {},
        user:{},
        constant: {
            tripType: {
                oneWay: {
                    name: '单程',
                    value: 1
                },
                returnWay: {
                    name: '往返',
                    value: 2
                }
            },
            dataChannel:{
                spider:{
                    name:'爬虫',
                    value:'spider'
                },
                api:{
                    name:'API',
                    value:'API'
                }
            },
            saleType: {
                public: {
                    name: 'Public',
                    value: 1
                },
                private: {
                    name: 'Private',
                    value: 2
                }
            },
            flightStatus: {
                normal: {
                    name: '正常',
                    value: 1
                },
                saleOut: {
                    name: '售罄',
                    value: 2
                },
                cancel: {
                    name: '取消',
                    value: 3
                }
            },
            routingStatus: {
                online: {
                    name: '上线',
                    value: 1
                },
                offline: {
                    name: '下线',
                    value: 2
                }
            },
            segmentType: {
                ow: {
                    name: '去程',
                    value: 1
                },
                owDep:{
                    name: '去程',
                    value: 4
                },
                owTransit:{
                    name: '去程中转',
                    value: 5
                },
                rwDep: {
                    name: '去程',
                    value: 2
                },
                rwRet: {
                    name: '返程',
                    value: 3
                }
            },
            blackScope: {
                airLine: {
                    name: '航线',
                    value: 1
                },
                flightCabin: {
                    name: '航班舱位',
                    value: 2
                },
                flightSeatCount: {
                    name: '航班座位数',
                    value: 3
                }
            },
            blackRuleType: {
                period: {
                    name: '时间段',
                    value: 1
                },
                tn: {
                    name: 'TN',
                    value: 2
                },
                tt: {
                    name: 'TT',
                    value: 3
                }
            },
            priceAdjustTripType: {
                ow: {
                    name: '单程',
                    value: '1'
                },
                rw: {
                    name: '往返',
                    value: '2'
                },
                rws: {
                    'name': '往返SP',
                    value: '3'
                }
            },
            priceAdjustState: {
                online: {
                    name: '上架',
                    value: '1'
                },
                offline: {
                    name: '下架',
                    value: '0'
                }
            },
            priceAdjustKind: {
                manual: {
                    name: '手动',
                    value: 1
                },
                auto: {
                    name: '自动',
                    value: 2
                }
            },
            priceAdjustType: {
                private: {
                    name: '私有',
                    value: 1
                },
                public: {
                    name: '公有',
                    value: 2
                }
            },
            airOrderStatus: {
                queryHold: {
                    name: '查询占位',
                    value: 1,
                },
                userHold: {
                    name: '用户占位',
                    value: 2,
                },
                issueTicket: {
                    name: '出票',
                    value: 3,
                },
                cancelHold: {
                    name: '取消占位',
                    value: 4,
                }
            },
            airOrderResultStatus:{
                undo: {
                    name: '待执行',
                    value: 1
                },
                doing: {
                    name: '执行中',
                    value: 2
                },
                timeout: {
                    name: '超时',
                    value: 3
                },
                success: {
                    name: '成功',
                    value: 4
                },
                fail: {
                    name: '失败',
                    value: 5
                }
            },
            logOperType:{
                add:{
                    name:'新增',
                    value:1
                },
                batchAdd:{
                    name:'批量新增',
                    value:2
                },
                modify:{
                    name:'修改',
                    value:3
                },
                batchModify:{
                    name:'批量修改',
                    value:4
                }
            }
        }
  },
  mutations: {
    SET_DATASRC: (state, datasrc) => {
      state.datasrc = datasrc;
    },
    SET_TABLESRC: (state, tablesrc) => {
      state.tablesrc = tablesrc;
    },
  },
  actions: {
  },
  getters: {
  }
})
