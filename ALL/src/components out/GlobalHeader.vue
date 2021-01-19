<template>
  <span>
    <a-icon
      class="trigger"
      :type="type"
      @click="clickEvent"
    />
    <a class="logout" href="javascript:;" @click="handleLogout">
      <a-icon type="logout"/>
      <span style="margin-left: 4px;">{{ $t('lang.logout') }}</span>
    </a>

    <a-dropdown class="switch-language" :trigger="['click']">
      <a-icon type="global"/>
      <a-menu slot="overlay" @click="switchLanguage">
        <a-menu-item v-for="language in languages" :key="language.key">
          <span>{{ language.text }}</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </span>
</template>

<script>
import { languages } from '@/lang/language.config'
import { asyncConsumerMenu, asyncAdminerMenu } from '@/config/menu.config'
import { mapActions, mapGetters } from 'vuex'
import { stringify } from 'querystring';

export default {
  name: 'GlobalHeader',
  props: {
    type: String,
    clickEvent: Function
  },
  data() {
    return {
      languages
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    ...mapActions(['Logout']),
    switchLanguage({ key }) {
      this.$i18n.locale = key;
    },
    handleLogout() {
      const that = this;
      const { Logout } = this;
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
            return Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: '登出失败'
            })
          })
        },
        onCancel() {
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.trigger {
  font-size: 18px;
  line-height: 50px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  position: relative;
  top: -8px;
}
.trigger:hover {
  color: #1890ff;
}
.logout {
  height: 50px;
  line-height: 50px;
  float: right;
  padding: 0 16px;
  text-decoration: none !important;
}

i.switch-language {
  font-size: 18px;
  line-height: 55px;
  height: 50px;
  padding: 0 16px;
  float: right;
  cursor: pointer;
}
i.switch-language:hover {
  color: #1890ff;
}
</style>
