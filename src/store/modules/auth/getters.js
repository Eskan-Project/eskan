export default {
  getUser: (state) => state.userDetails,
  getRole: (state) => state.userDetails.role,
  isAuth: (state) => state.isAuth,
  isError: (state) => state.error,
  isAdmin: (state) => state.userDetails.role === "admin",
  isOwner: (state) => state.userDetails.role === "owner",
};
