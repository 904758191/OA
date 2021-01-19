<template>
  <div class="welcome">
    <img class="logo" src="@/assets/componylogo.png" alt="">
    <p class="welcometxt">欢迎使用</p>
    <p class="smalltitle">宁波甬航商旅-运价直连系统2.0版本</p>
  </div>
</template>

<script>
import { asyncConsumerMenu, asyncAdminerMenu } from '@/config/menu.config'

export default {
  name: 'Welcome',
  props: {},
  data() {
    return {
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .welcome {
    margin-top: 16%;
    text-align: center;
    .logo {
      height: 200px;
    }
    .welcometxt {
      font-size: 38px;
      margin-top: 40px;
    }
    .smalltitle {
      font-size: 24px;
      margin-top: 16px;
    }
  }
</style>
