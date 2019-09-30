import { userService } from '../services';
import router from '../router';

const user = JSON.parse(localStorage.getItem('user'));
const state = user
    ? { status: { loggedIn: true, loaded: false }, user: user.current }
    : { status: { loaded: true }, user: null };

const actions = {
    login({ dispatch, commit }, { username, password }) {
        commit('loginRequest', { username });

        userService.login(username, password)
            .then(
                newUser => {
                    commit('loginSuccess', newUser);
                    router.push('/shelfs');
                },
                error => {
                    commit('loginFailure', error);
                    dispatch('modal/error', error, { root: true });
                }
            );
    },
    logout({ commit }) {
        userService.logout();
        commit('logout');
    },
    register({ dispatch, commit }, newUser) {
        commit('registerRequest', newUser);

        userService.register(newUser)
            .then(
              newUser => {
                    commit('registerSuccess', newUser);
                    router.push('/login');
                    setTimeout(() => {
                        // display success message after route change completes
                        dispatch('modal/success', 'Registration successful', { root: true });
                    })
                },
                error => {
                    commit('registerFailure', error);
                    dispatch('modal/error', error, { root: true });
                }
            );
    },
    tokenRefresh({ dispatch, commit }) {
      userService.tokenRefresh()
        .then(newUser => {
          commit('userSave', newUser);
      },
      error => {
        commit('loginFailure', error);
        dispatch('modal/error', error, { root: true });
      });
  },
};

const mutations = {
    loginRequest(state, newUser) {
        state.status = { loggingIn: true };
        state.user = newUser;
    },
    loginSuccess(state, newUser) {
        state.status = { loggedIn: true };
        state.user = newUser;
    },
    loginFailure(state) {
        state.status = {};
        state.user = null;
    },
    logout(state) {
        state.status = {};
        state.user = null;
    },
    registerRequest(state) {
        state.status = { registering: true };
    },
    registerSuccess(state, newUser) {
        state.status = {};
        state.user = newUser;
    },
    registerFailure(state) {
        state.status = {};
    },
    userSave(state, newUser) {
      state.status.loaded = true;
      state.user = newUser;
    }
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
};
