import { bookService } from '../services';

const state = {
  status: {
    loading           : false,
    loadingBookToShow : false,
  },
  books: null,
  book: null,
  foundBooks: [],
  bookToShow: {}
};

const actions = {
  getAll({ dispatch, commit }) {
    commit('allBooksRequest');

    bookService.getAll().then(
      books => {
        commit('booksRequestSuccess', books);
      },
      error => {
        commit('booksRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  getById({ dispatch, commit }, book) {
    commit('bookByNameRequest');

    bookService.getById(book.bookId, book.shelf_id, book.user_id).then(
      book => {
        commit('bookRequestSuccess', book);
      },
      error => {
        commit('booksRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  addBook({ dispatch, commit }, book) {
    commit('addBook');

    bookService.add(book).then(
      book => {
        commit('addBookSuccess', book);
      },
      error => {
        commit('bookRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  updateBook({ dispatch, commit }, book) {
    commit('addBook');

    bookService.update(book).then(
      book => {
        commit('updateBookSuccess', book);
      },
      error => {
        commit('bookRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  removeBook({ dispatch, commit }, book) {
    commit('addBook');

    bookService.delete(book.bookId, book.shelf_id, book.user_id).then(
      book => {
        commit('removeBookSuccess', book);
      },
      error => {
        commit('bookRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  searchBooks({ dispatch, commit }, name) {
    bookService.searchBooks(name).then(
      books => {
        commit('foundBooks', books);
      },
      error => {
        commit('bookRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  showBook({ dispatch, commit }, id) {
    commit('loadingBookToShow');
    bookService.showBook(id).then(
      book => {
        commit('showBook', book);
      },
      error => {
        commit('bookRequestFailure', error);
        dispatch('modal/error', error, { root: true });
      }
    );
  },
  saveBookToStore({ commit }, book) {
    commit('bookRequestSuccess', book);
  },
  removeFoundBooks({ commit }) {
    commit('removeFoundBooks');
  }
};

const mutations = {
  allBooksRequest(state) {
    state.status = { loading: true };
  },
  booksRequestSuccess(state, books) {
    state.status = { loading: false };
    state.books = books;
  },
  bookByNameRequest(state) {
    state.status = { loading: true };
  },
  bookRequestSuccess(state, book) {
    state.status = { loading: false };
    state.book = book;
  },
  booksRequestFailure(state) {
    state.status = {};
    state.books = null;
  },
  bookRequestFailure(state) {
    state.status = {};
    state.book = null;
  },
  addBook(state) {
    state.status = { loading: true };
  },
  addBookSuccess(state, book) {
    state.status = { loading: false };
    state.book = book;
  },
  updateBookSuccess(state, book) {
    state.status = { loading: false };
    state.book = book;
  },
  searchBooks(state) {
    state.status = { loading: true };
  },
  foundBooks(state, books) {
    state.status = { loading: false };
    state.foundBooks = books;
  },
  loadingBookToShow(state) {
    state.status = { loadingBookToShow: true };
  },
  showBook(state, book) {
    state.status = { loadingBookToShow: false };
    state.bookToShow = book;
  },
  removeBookSuccess(state) {
    state.status = { loading: false };
  },
  removeFoundBooks(state) {
    state.foundBooks = [];
  }
};

export const books = {
  namespaced: true,
  state,
  actions,
  mutations
};
