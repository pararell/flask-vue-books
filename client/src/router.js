import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Shelfs from './components/Shelfs.vue';
import Shelf from './components/Shelf.vue';
import Book from './components/Book.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    { path: '/', component: Shelfs },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', component: Register },
    { path: '/shelfs', name: 'shelfs', component: Shelfs },
    { path: '/shelf/:shelfName', name: 'shelf', component: Shelf },
    { path: '/book/:shelfId/:bookId', name: 'book', component: Book },
    { path: '*', redirect: '/' },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  return next();
});

export default router;
