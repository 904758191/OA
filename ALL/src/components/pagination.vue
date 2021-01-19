<template>
  <div>
    <div class="card-content row">
      <div class="col-sm-6">
        <el-select v-model="pagination.perPage" placeholder="每页页数">
          <el-option
            v-for="item in pagination.perPageOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="col-sm-6">
        <p-pagination
          class="pull-right"
          v-model="pagination.currentPage"
          :per-page="pagination.perPage"
          :total="pagination.total"
        ></p-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {Select,Option} from 'element-ui'
import PPagination from 'src/components/UIComponents/Pagination.vue'

export default {
  components:{
    PPagination
  }
};
</script>
