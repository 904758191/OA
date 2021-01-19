<template>
  <div>
    <button class="btn btn-info btn-fill">返回</button> 
    <div class="form-group">
      <label>航司：
        <input type="text" placeholder="TR" class="form-control">
        
      </label>
    </div>
    <div class="form-group">
      <label>机场：
        <input type="text" placeholder="HKG" class="form-control">
        <span>-</span>
        <input type="text" placeholder="SIN" class="form-control">
      </label>
    </div>
    <div class="form-group">
      <label>城市：
        <input type="text" placeholder="HKG" class="form-control">
        <span>-</span>
        <input type="text" placeholder="SIN" class="form-control">
      </label>
    </div>
    <div class="form-group">
      <label>航班号：
        <input type="text" placeholder="TR981" class="form-control">
      </label>
    </div>
    <div class="form-group">
      <label>乘机时间：
        <el-date-picker placeholder="2021-02-04 18:15 ~ 2021-02-04 22:15"></el-date-picker>
      </label>
    </div>
    <div class="form-group">
      <label>舱位：
        <input type="text" placeholder="M1" class="form-control">
      </label>
    </div>
    <div class="form-group">
      <label>成人价：
        <input type="text" placeholder="909" class="form-control">
        <span>元</span>
      </label>
    </div>
  </div>
</template>

<script>
  import {DatePicker, TimeSelect, Slider, Tag, Input, Button} from 'element-ui'
  import PProgress from 'src/components/UIComponents/Progress.vue'
  import PSwitch from 'src/components/UIComponents/Switch.vue'
export default {
  components: {
      [DatePicker.name]: DatePicker,
      [TimeSelect.name]: TimeSelect,
      [Slider.name]: Slider,
      [Tag.name]: Tag,
      [Input.name]: Input,
      [Button.name]: Button,
      PSwitch,
      PProgress
    },
}
</script>