// @ts-ignore
import { createStore } from 'vuex';
import { jwtDecode } from 'jwt-decode';

interface State {
  token: string | null;
}

const store = createStore<State>({
  state: {
    token: localStorage.getItem('token') || null,
  },
  mutations: {
    setToken(state, token: string) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  actions: {
    saveToken({ commit }, token: string) {
      commit('setToken', token);
    },
    removeToken({ commit }) {
      commit('clearToken');
    },
  },
  getters: {
    isAuthenticated(state): boolean {
      return !!state.token;
    },
    getToken(state): object | null {
      if (state.token) {
        try {
          return jwtDecode(state.token);
        } catch (error) {
          console.error("Invalid token:", error);
          return null;
        }
      }
      return null;
    },
    userRole(state: { token: string; }): string | null {
      if (state.token) {
        try {
          const decodedToken = jwtDecode(state.token);
          return decodedToken.user_role || null;
        } catch (error) {
          console.error("Invalid token:", error);
          return null;
        }
      }
      return null;
    },
  },
});

export default store;
