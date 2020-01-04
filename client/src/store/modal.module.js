const state = {
  showModal: '',
};

const actions = {
  toggleModal({ commit }, type) {
    commit('toggleModal', type);
  },
};

const mutations = {
  toggleModal(state, type) {
      state.showModal = state.showModal === type ? '' : type;
  },
};

export const modal = {
  namespaced: true,
  state,
  actions,
  mutations
};
