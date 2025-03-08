import { createStore } from "vuex";
import auth from "./modules/auth";
import property from "./modules/property";
import notifications from "./modules/notifications";

export default createStore({
  state: {
    loading: false,
  },
  mutations: {
    setLoading(state, loading) {
      state.loading = loading;
    },
  },
  modules: {
    auth,
    property,
    notifications,
  },
});
