import { createStore } from "vuex";
import auth from "./modules/auth";
import property from "./modules/property";
import notifications from "./modules/notifications";
import users from "./modules/users";

export default createStore({
  state: {
    loadingCount: 0,
  },
  mutations: {
    startLoading(state) {
      state.loadingCount++;
    },
    stopLoading(state) {
      state.loadingCount--;
    },
  },
  actions: {
    startLoading({ commit }) {
      commit("startLoading");
    },
    stopLoading({ commit }) {
      commit("stopLoading");
    },
  },
  getters: {
    isLoading: (state) => state.loadingCount > 0,
  },
  modules: {
    auth,
    property,
    notifications,
    users,
  },
});
