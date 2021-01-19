<template>
    <div>
        <el-table :data="logs" :loading="loading" size="small">
            <el-table-column type="index" width="50" />
            <el-table-column prop="dateTime" label="时间" width="180px"/>
            <el-table-column prop="operName" label="操作人" />
            <el-table-column prop="operType" label="操作" >
                <template slot-scope="scope">
                    {{getOperType(scope.row.operType)}}
                </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" >
                <template slot-scope="scope">
                    <el-tooltip placement="right" >
                        <div slot="content"><span v-html="formatContent(scope.row.content)"></span></div>
                        <span style="cursor: pointer; color: #449be6;">详情</span>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: right; padding-top: 20px;">
            <el-button-group>
                <el-button :disabled="nowPage <= 1" size="small" icon="el-icon-arrow-left" @click="changePage(-1)"></el-button>
                <el-button :disabled="!hasMore" size="small" icon="el-icon-arrow-right" @click="changePage(1)"></el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script>
    import connector from "../service/connector";
    import _ from 'underscore'
    export default {
        name: "Log",
        props: {
            id: Number, // id
            operModule: String, // 日志对应数据库表名，约定
        },
        data() {
            return {
                logs: [],
                loading: false,
                nowPage: 1,
                hasMore: false,
                pageSize: 20
            }
        },
        mounted() {
            this.refresh(this.operModule, this.id, this.nowPage);
        },
        computed: {
            dataId() {
                return this.id;
            }
        },
        methods:{
            getOperType(type) {
                let logOperType = this.$store.state.constant.logOperType;
                for (let t in logOperType){
                    if (logOperType[t]['value'] === type){
                        return logOperType[t]['name']
                    }
                }
            },
            formatContent(v) {
                return (function (v) {
                    let obj;
                    try {
                        obj = JSON.parse(v);
                        for (let key in obj){
                            if (Object.prototype.toString.call(obj[key]) === '[object Array]'){
                                obj[key] = JSON.stringify(obj[key])
                            }
                        }
                    } catch (error) {
                        return '日志格式有问题';
                    }
                    return _.pairs(obj).join('<br>');
                })(v)
            },
            changePage(v) {
                this.nowPage = this.nowPage + +v;
                this.refresh(this.operModule, this.dataId, this.nowPage);
            },
            refresh(operModule, id, pageNum) {
                this.loading = true;
                connector.priceSericeAxios().post('/log/getLogs',{
                    operModule:operModule,
                    dataId:id,
                    pageParam:{
                        pageNum:pageNum,
                        pageSize:this.pageSize
                    }
                }).then(res => {
                    if (!res.code) {
                        if (res.data.list.length === 0) { // 无内容返回
                            this.$message.warning('没有更多的数据了');
                            if (this.nowPage > 1) {
                                this.nowPage = this.nowPage - 1;
                            }
                            this.hasMore = false;
                            return;
                        }
                        let resData = res.data.list || [];
                        if (resData.length > this.pageSize){
                            this.hasMore = true;
                        }
                        this.logs = _.map(resData, (v, i) => {
                            v.number = i;
                            v.dateTime = `【${v.operTime}】`;
                            return v;
                        });
                    } else {
                        this.$message.error(res.message, 2);
                    }
                }).catch(() => {
                    this.$message.error('请求失败', 2);
                }).finally(() => {
                    this.loading = false;
                })
            }
        }
    }
</script>

<style scoped>

</style>
