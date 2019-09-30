const state = {
  type: null,
  message: null,
  showModal: false,
};

const actions = {
  toggleModal({ commit }) {
    commit('toggleModal');
  },
  success({ commit }, message) {
      commit('success', message);
  },
  error({ commit }, message) {
      commit('error', message);
  },
  clear({ commit }, message) {
      commit('success', message);
  }
};

const mutations = {
  toggleModal(state) {
      state.showModal = !state.showModal;
  },
  success(state, message) {
      state.type = 'modal-success';
      state.message = message;
  },
  error(state, message) {
      state.type = 'modal-danger';
      state.message = message;
  },
  clear(state) {
      state.type = null;
      state.message = null;
  }
};

export const modal = {
  namespaced: true,
  state,
  actions,
  mutations
};
