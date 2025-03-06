export default {
  setUser(state, user) {
    state.user = user;
    state.role = user?.role || "user";
    state.isAuth = !!user;
    state.error = null;
  },
  setError(state, error) {
    state.error = error;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  logout(state) {
    state.user = null;
  },
};
