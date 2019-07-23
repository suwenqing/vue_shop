import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/main.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)

//给Vue原型对象添加方法
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// 在Authorization中添加token
axios.interceptors.request.use(config=>{
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
//响应拦截 获取想要得到的数据
axios.interceptors.response.use(res=>{
  return res.data
})

Vue.prototype.axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
