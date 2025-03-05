export default {
  getUser: (state) => state.user,
  getRole: (state) => state.role,
  isAuth: (state) => state.isAuth,
  isError: (state) => state.error,
  isLoading: (state) => state.loading,
  isAdmin: (state) => state.role === "admin",
  isOwner: (state) => state.role === "owner",
};
