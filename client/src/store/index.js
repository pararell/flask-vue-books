import Vue from 'vue';
import Vuex from 'vuex';

import { modal } from './modal.module';
import { account } from './account.module';
import { books } from './books.module';
import { shelfs } from './shelfs.module';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    modal,
    account,
    books,
    shelfs
  }
});
