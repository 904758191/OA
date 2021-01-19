<template>
  <div>
    <a-table :dataSource="data" :pagination="false" :scroll="{ x: true }" rowKey="number" :loading="loading" size="small">
      <a-table-column title="时间" data-index="dateTime" key="dateTime" fixed="left"></a-table-column>
      <a-table-column title="用户" data-index="user" key="user"></a-table-column>
      <a-table-column title="操作" data-index="action" key="action"></a-table-column>
      <a-table-column title="内容" data-index="actionrecord" key="actionrecord">
        <template v-slot="rowdata">
          <a-tooltip placement="left">
            <template slot="title">
              <span v-html="formatContent(rowdata)"></span>
            </template>
            <span style="cursor: pointer; color: #449be6;">详情</span>
          </a-tooltip>
        </template>
      </a-table-column>
    </a-table>
    <div style="text-align: right; padding-top: 20px;">
      <a-button-group>
        <a-button :disabled="nowpage<=0" size="small" icon="left" @click="changePage(-1)"></a-button>
        <a-button :disabled="!hasmore" size="small" icon="right" @click="changePage(1)"></a-button>
      </a-button-group>
    </div>
  </div>
</template>

<script>
import { pageSizeInit } from '@/config/defaultSetting';
import { logList } from '@/api/log' 
import { dateFormat } from '@/utils/util' 
import _ from 'underscore'

export default {
  name: 'Log',
  props: {
    id: String, // id
    db: String, // 日志对应数据库表名，约定
    src: String,
  },
  data() {
    return {
      data: [],
      loading: false,
      nowpage: 0,
      hasmore: true,
    }
  },
  mounted() {
    this.refresh(this.db, this.id, this.nowpage, this.src);
  },
  computed: {
    policyid() {
      return this.id;
    }
  },
  methods: {
    formatContent(v) {
      return (function (v) {
        let obj;
        try {
          obj = JSON.parse(v);
        } catch (error) {
          return '日志格式有问题';
        }
        return _.pairs(obj).join('<br>');
      })(v)
    },
    changePage(v) {
      this.nowpage = this.nowpage + +v;
      this.refresh(this.db, this.policyid, this.nowpage, this.src);
    },
    refresh(db, id, pageNum, src = '', pageSize = pageSizeInit) {
      this.loading = true;
      logList({
        collection: db,
        policyId: id, 
        pageNum: pageNum,
        pageSize: pageSize,
        src: src
      }).then(res => {
        if (!res.state) {
          if (res.data.length === 0) { // 无内容返回
            this.$message.warning('没有更多的数据了');
            if (this.nowpage > 0) {
              this.nowpage = this.nowpage - 1;
            }
            this.hasmore = false;
            return;
          }
          this.hasmore = true;
          let resdata = res.data || [];
          this.data = _.map(resdata, (v, i) => {
            v.number = i;
            v.dateTime = `【${dateFormat(new Date(v.actiontime), 'YYYY-MM-DD HH:mm')}】`;
            return v;
          });
        } else {
          this.$message.error(res.message, 2);
        }
      }).catch(err => {
        this.$message.error('请求失败', 2);
      }).finally(() => {
        this.loading = false;
      })
    },
  }
}
</script>

<style lang="less" scoped>
</style>
