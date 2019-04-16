export default {
  namespaced: true,
  state: {
    item: {
      stnm: null,
      lgtd: null,
      lttd: null
    }
  },
  getters: {
    item(state) {
      return state.item
    }
  },
  mutations: {
    CHANGE_ITEM(state, value) {
      state.item = value
    }
  }
}
