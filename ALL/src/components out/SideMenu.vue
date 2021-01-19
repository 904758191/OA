<template>
  <a-menu theme="dark" mode="inline" :openKeys="openKeys" :defaultSelectedKeys="defaultSelectedKeys" @openChange="onOpenChange">
    <template v-for="navnode in navlist">
      <a-sub-menu :key="navnode.key">
        <span slot="title">
          <a-icon :type="navnode.icon"/>
          <span>{{ navnode.name }}</span>
        </span>
        <a-menu-item v-for="node in navnode.children" :key="node.key">
          <router-link :to="node.to">{{node.name}}</router-link>
        </a-menu-item>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<script>
import { spnames, asyncConsumerMenuSP, asyncConsumerMenu, asyncAdminerMenu } from '@/config/menu.config'
import _ from 'underscore'

export default {
  name: 'SideMenu',
  props: {},
  data() {
    return {
      openKeys: [],
      rootSubmenuKeys: [],
      defaultSelectedKeys: [],
      navlist: []
    }
  },
  mounted() {
    // 根据用户权限修改左侧菜单
    const adminflag = JSON.parse(localStorage.getItem('User-Info')).adminuser;
    const username = JSON.parse(localStorage.getItem('User-Info')).username;
    if (adminflag === 1) {
      this.navlist = asyncAdminerMenu;
      this.rootSubmenuKeys = _.map(asyncAdminerMenu, v => v.key);
    } else if (spnames.includes(username)) {
      this.navlist = asyncConsumerMenuSP;
      this.rootSubmenuKeys = _.map(asyncConsumerMenuSP, v => v.key);
    } else {
      this.navlist = asyncConsumerMenu;
      this.rootSubmenuKeys = _.map(asyncConsumerMenu, v => v.key);
    }

    let tmp = this.$route.path.split('/');
    let key = tmp[tmp.length - 2];
    // 默认打开，匹配路由中的name 和 当前的key
    this.openKeys.push(key);
    this.defaultSelectedKeys.push(this.$route.name);
  },
  computed: {
    policyid() {
      return this.id;
    }
  },
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
  }
}
</script>

<style lang="less" scoped>
</style>
