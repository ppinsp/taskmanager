const state = {
  snackbar: {
    message: '',
    type: '',
    active: false
  }
}

const actions = {
  setSnackbar ({ commit }, payload) {
    commit('SET_SNACKBAR', payload)
  }
}

const mutations = {
  SET_SNACKBAR (state, payload) {
    state.snackbar = payload
  }
}

const getters = {
  snackbar: (state) => state.snackbar
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
