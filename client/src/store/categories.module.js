import { categoryService } from '../services';

const state = {
  status: {
    loading: false
  },
  allCategories: null,
  category: null,
  sorts: [
    { label: 'added',  name: 'id',     active: 'desc' },
    { label: 'year',   name: 'year',   active: ''  },
    { label: 'name',   name: 'title',  active: '' },
    { label: 'author', name: 'author', active: '' }
  ]
};

const actions = {
  getAllCategories({ dispatch, commit }, user) {
    commit('allCategoriesRequest');

    categoryService.getAll(user).then(categories => {
        commit('categoriesRequestSuccess', categories);
      },
      error => {
        commit('categoriesRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  getById({ dispatch, commit }, idAndUser) {
    commit('categoryByNameRequest');

    categoryService.getById(idAndUser.id, idAndUser.user).then(
      category => {
        commit('categoryRequestSuccess', category);
      },
      error => {
        commit('categoriesRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  addCategory({ dispatch, commit }, category) {
    commit('addCategory');

    categoryService.add(category).then(
      category => {
        commit('addCategorysuccess', category);
      },
      error => {
        commit('categoryRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  updateCategory({ dispatch, commit }, category) {
    commit('addCategory');

    categoryService.update(category).then(
      category => {
        commit('addCategorysuccess', category);
      },
      error => {
        commit('categoryRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  removeCategory({ dispatch, commit }, category) {
    commit('removeCategory');

    categoryService.delete(category).then(
      category => {
        commit('removeCategorysuccess');
      },
      error => {
        commit('categoryRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  saveCategoryToStore({ commit }, category) {
    commit('categoryRequestSuccess', category);
  },
  setSort({ commit }, sort) {
    commit('setSort', sort);
  }
};

const mutations = {
  allCategoriesRequest(state) {
    state.status = { loading: true };
  },
  categoriesRequestSuccess(state, categories) {
    state.status    = { loading: false };
    state.allCategories = categories;
  },
  categoryRequestSuccess(state, category) {
    state.status    = { loading: false };
    state.category     = category;
  },
  categoryByNameRequest(state) {
    state.status = { loading: true };
    state.category  = null;
  },
  categoryRequestFailure(state) {
    state.status    = {};
    state.allCategories = null;
    state.category     = null;
  },
  addCategory(state) {
    state.status = { loading: true };
  },
  addCategorysuccess(state, category) {
    state.status = { loading: false };
    state.category = category;
  },
  removeCategory(state) {
    state.status = { loading: true };
  },
  removeCategorysuccess(state, category) {
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

    state.category = state.category
      ? {...state.category,
          books: state.category.books
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

export const categories = {
  namespaced: true,
  state,
  actions,
  mutations
};
