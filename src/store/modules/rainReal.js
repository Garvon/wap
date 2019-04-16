let now = new Date()
export default {
  namespaced: true,
  state: {
    item:null,
    type:"",
    startDate:now.formatDate('yyyy-MM-dd 08:00:00'),
    endDate: now.formatDate('yyyy-MM-dd 08:00:00').toDate().datePro('{%H+1}').formatDate('yyyy-MM-dd HH:mm:ss')
  },
  getters: {
    item(state) {
      return state.item
    },
    type(state) {
      return state.type
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
    CHANGE_TYPE(state, value) {
      state.type = value
    },
    CHANGE_STARTDATE(state, value) {
      state.startDate = value
    },
    CHANGE_ENDDATE(state, value) {
      state.endDate = value
    }
  }
}
