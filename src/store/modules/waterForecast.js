
let now = new Date()
export default {
  namespaced: true,
  state: {
    item: {
      stnm: null,
      lgtd: null,
      lttd: null
    },
    startDate: now.formatDate('yyyy-MM-dd'),
    endDate: new Date(now).datePro('{%d+7}').formatDate('yyyy-MM-dd')
  },
  getters: {
    item(state) {
      return state.item
    },
    startDate(state) {
      return state.startDate
    },
    endDate(state) {
      return state.endDate
    }
  },
  mutations: {
    CHANGE_ITEM(state, value) {
      state.item = value
    },
    CHANGE_STARTDATE(state, value) {
      state.startDate = value
    },
    CHANGE_ENDDATE(state, value) {
      state.endDate = value
    }
  }
}
