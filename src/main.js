
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import http from './api/http'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$ajax = axios;

Vue.prototype.$http=http;        //把封装的http 挂载到全局

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
