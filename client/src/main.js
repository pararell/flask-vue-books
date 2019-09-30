import VeeValidate from 'vee-validate';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import vuetify from './plugins/vuetify';

Vue.use(VeeValidate);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
