import { shelfService } from '../services';

const state = {
  status: {
    loading: false
  },
  allShelfs: null,
  shelf: null
};

const actions = {
  getAllShelfs({ dispatch, commit }, user) {
    commit('allShelfsRequest');

    shelfService.getAll(user).then(
      shelfs => {
        commit('shelfsRequestSuccess', shelfs);
      },
      error => {
        commit('shelfsRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  getByName({ dispatch, commit }, nameAndUser) {
    commit('shelfByNameRequest');

    shelfService.getByName(nameAndUser.name, nameAndUser.user).then(
      shelf => {
        commit('shelfRequestSuccess', shelf);
      },
      error => {
        commit('shelfsRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  addShelf({ dispatch, commit }, shelf) {
    commit('addShelf');

    shelfService.add(shelf).then(
      shelf => {
        commit('addShelfsuccess', shelf);
      },
      error => {
        commit('shelfRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  removeShelf({ dispatch, commit }, shelf) {
    commit('removeShelf');

    shelfService.delete(shelf).then(
      shelf => {
        commit('removeShelfsuccess');
      },
      error => {
        commit('shelfRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  saveShelfToStore({ commit }, shelf) {
    commit('shelfRequestSuccess', shelf);
  },
};

const mutations = {
  allShelfsRequest(state) {
    state.status = { loading: true };
  },
  shelfsRequestSuccess(state, shelfs) {
    state.status    = { loading: false };
    state.allShelfs = shelfs;
  },
  shelfRequestSuccess(state, shelf) {
    state.status    = { loading: false };
    state.shelf     = shelf;
  },
  shelfByNameRequest(state) {
    state.status = { loading: true };
  },
  bookRequestSuccess(state, shelf) {
    state.status = { loading: false };
    state.shelf = shelf;
  },
  shelfRequestFailure(state) {
    state.status    = {};
    state.allShelfs = null;
    state.shelf     = null;
  },
  addShelf(state) {
    state.status = { loading: true };
  },
  addShelfsuccess(state, shelf) {
    state.status = { loading: false };
    state.shelf = shelf;
  },
  removeShelf(state) {
    state.status = { loading: true };
  },
  removeShelfsuccess(state, shelf) {
    state.status = { loading: false };
  },
};

export const shelfs = {
  namespaced: true,
  state,
  actions,
  mutations
};
