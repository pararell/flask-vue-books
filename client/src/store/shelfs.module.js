import { shelfService } from '../services';

const state = {
  status: {
    loading: false
  },
  allShelfs: null,
  shelf: null,
  sorts: [
    { label: 'added',  name: 'id',     active: 'desc' },
    { label: 'year',   name: 'year',   active: ''  },
    { label: 'name',   name: 'title',  active: '' },
    { label: 'author', name: 'author', active: '' }
  ]
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
  getById({ dispatch, commit }, idAndUser) {
    commit('shelfByNameRequest');

    shelfService.getById(idAndUser.id, idAndUser.user).then(
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
  setSort({ commit }, sort) {
    commit('setSort', sort);
  }
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
    state.shelf  = null;
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
  setSort(state, selectSort) {
    state.sorts = state.sorts
      .map(sort => ({...sort, active: selectSort.name === sort.name
          ? selectSort.active
          : ''
    }));
    const activeSort = state.sorts
      .filter(sort => sort.active)[0];

    state.shelf = state.shelf
      ? {...state.shelf,
          books: state.shelf.books
            .map(book => ({...book, id: book.id.toString()}))
            .sort((a,b) => {
              if (activeSort.active === 'asc') {
                return a[activeSort.name].localeCompare(b[activeSort.name]);
              } else {
                return b[activeSort.name].localeCompare(a[activeSort.name]);
              }
            })
        }
      : null;
  }
};

export const shelfs = {
  namespaced: true,
  state,
  actions,
  mutations
};
