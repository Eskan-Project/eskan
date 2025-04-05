export default {
  // Add getter for users array
  users: (state) => state.users,
  userInfo: (state) => state.userInfo,
  userRole: (state) => state.userInfo.role,
  isActive: (state) => state.userInfo.isActive,
  paidProperties: (state) => state.userInfo.paidProperties,
  freePropertyViewed: (state) => state.userInfo.freePropertyViewed,
  userPhoto: (state) => state.userInfo.photo,
  error: (state) => state.error,
};
