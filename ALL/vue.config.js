module.exports = {
  chainWebpack: config => {
      config.module.rules.delete('eslint');
  },

devServer:{
  proxy:{
    '/api':{
      target:"http://192.168.31.174:12679",
      changOrigin:true,
      pathRewrite:{
        '^/api':"http://localhost:8000"
      }
    }
  }
}
}