<template>
    <!-- 数据编辑修改页面 -->
    <div class="modal fade" id="error-modal" tabindex="-1" role="dialog"
         aria-labelledby="editor-title">
        <div class="modal-dialog" style="margin-top: 180px; width: 600px; background-color: #2a2a2a" role="document">
            <form data-v-0e46d3c1="" id="editor" action="#" class="modal-content form-horizontal">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"
                            aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h6 class="modal-title" id="editor-title"><i class="fa fa-bell mr-10"></i>错误信息</h6>
                </div>
                <div class="modal-body pt-5 pb-0 pl-30 pr-5">
                    <div class="row mb-0">
                        <div class="col-md-12 mb-0">
                            <div class="form-group mb-5 required">
                                <label class="col-sm-4 control-label">Type:</label>
                                <div class="col-sm-8">
                                    <h6 class="mt-5">{{$store.state.error['type']}}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-0">
                        <div class="col-md-12 mb-0">
                            <div class="form-group mb-5 required">
                                <label class="col-sm-4 control-label">Status:</label>
                                <div class="col-sm-8">
                                    <h6 class="mt-5">{{$store.state.error['status']}}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-0">
                        <div class="col-md-12 mb-0">
                            <div class="form-group mb-5 required">
                                <label class="col-sm-4 control-label">Message:</label>
                                <div class="col-sm-8">
                                    <h6 class="mt-5">{{$store.state.error['message']}}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer pt-0 pb-5 pr-30">
                    <button type="button" class="btn btn-default btn-xs btn-icon left-icon"
                            data-dismiss="modal">
                        <i class="fa fa-times"></i><span>关闭</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ErrorModal",
        props: {
            error: Object
        }
    }
</script>

<style scoped>

</style>