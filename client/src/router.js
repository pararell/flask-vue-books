import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Shelfs from './components/Shelfs.vue';
import Shelf from './components/Shelf.vue';
import Book from './components/Book.vue';
import Categories from './components/Categories.vue';
import Category from './components/Category.vue';
import AddBook from './components/AddBook.vue';
import BookInfo from './components/BookInfo.vue';

Vue.use(Router);

var rememberScrolling = {};

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    { path: '/', component: Shelfs },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', component: Register },
    { path: '/shelfs', name: 'shelfs', component: Shelfs },
    { path: '/shelf/:shelfId', name: 'shelf', component: Shelf },
    { path: '/categories', name: 'categories', component: Categories },
    { path: '/category/:categoryId', name: 'category', component: Category },
    { path: '/book/:shelfId/:bookId', name: 'book', component: Book },
    { path: '/addbook', name: 'addBook', component: AddBook },
    { path: '/bookinfo/:bookId', name: 'bookInfo', component: BookInfo },
    { path: '*', redirect: '/' },
  ],
  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if(rememberScrolling[to.path] && to.name != from.name) {
          resolve(rememberScrolling[to.path]);
        } else if (savedPosition) {
          resolve(savedPosition);
        } else {
          resolve({ x: 0, y: 0 });
        }
      }, 200)
    });
  }
});

router.beforeEach((to, from, next) => {
  if (window && window.scrollY) {
    rememberScrolling[from.path] =  {x : 0, y: window.scrollY};
  }
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
