import Vue from 'vue'
import Vuex from 'vuex'
import waterForecast from './modules/waterForecast'
import waterReal from './modules/waterReal'
import rainReal from './modules/rainReal'
import warnmsg from './modules/warnmsg'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    waterForecast,
    waterReal,
    rainReal,
    warnmsg
  }
})
