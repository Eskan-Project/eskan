export default {
  // Add new mutation for handling multiple users
  setUsers(state, users) {
    state.users = users;
  },
  setUserInfo(state, userInfo) {
    state.userInfo = {
      ...state.userInfo,
      ...userInfo,
    };
  },

  setUser(state, user) {
    state.user = user;
  },

  updateUserInfo(state, updates) {
    state.userInfo = {
      ...state.userInfo,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  },

  incrementFreePropertyViewed(state) {
    state.userInfo.freePropertyViewed =
      (state.userInfo.freePropertyViewed || 0) + 1;
  },

  addPaidProperty(state, propertyId) {
    if (!state.userInfo.paidProperties.includes(propertyId)) {
      state.userInfo.paidProperties.push(propertyId);
    }
  },

  setError(state, error) {
    state.error = error;
  },

  clearError(state) {
    state.error = "";
  },

  resetUserInfo(state) {
    state.userInfo = {
      createdAt: "",
      email: "",
      freePropertyViewed: null,
      gender: "",
      isActive: true,
      location: "",
      name: "",
      nationalId: "",
      paidProperties: [],
      photo: "",
      role: "user",
      uid: "",
      updatedAt: "",
    };
  },
};
