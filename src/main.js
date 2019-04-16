import Vue from 'vue'
import util from '@/utils/util'
import App from './App.vue'
import router from './router'
import store from './store'
import 'iview/dist/styles/iview.css'
import '@/styles/common.scss'
import '@/utils/rem'
import FastClick from 'fastclick'
import DatetimePlugin from 'vux/src/plugins/datetime'
import LoadingPlugin from 'vux/src/plugins/loading'

Vue.config.productionTip = false
Vue.use(util)
Vue.use(DatetimePlugin)
Vue.use(LoadingPlugin)

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false);
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')