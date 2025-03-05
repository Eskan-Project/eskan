import { createStore } from "vuex";
import auth from "./modules/auth";

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
  },
});
