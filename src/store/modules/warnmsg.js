
let now = new Date()
export default {
  namespaced: true,
  state: {
    item: {
      creattm:"",
      lgtd:118.283333,
      lttd:40.383333,
      msgcontent:"预计2018-09-18 08:00:00至2018-09-19 02:00:00水库流量1222.00m3/s,超预警1379.19-238.5m3/s,请相关人员注意防范。",
      msgid:"855f6c52a2e14700828d2cdbbee96aa4",
      readback:0,
      stcd:"30134000",
      stnm:"水库",
      warntypeid:1,
      warntypenm:"超警戒水位"
    },
  },
  getters: {
    item(state) {
      return state.item
    },
   
  },
  mutations: {
    CHANGE_ITEM(state, value) {
      state.item = value
    },
   
  }
}
