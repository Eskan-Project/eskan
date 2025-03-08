export default {
  setUser(state, userData) {
    state.userDetails = { ...state.userDetails, ...userData };
    state.isAuth = !!userData.uid;
    state.error = null;
  },
  setError(state, error) {
    state.error = error;
  },
  logout(state) {
    state.userDetails = {
      uid: null,
      email: "",
      name: "",
      photo: "",
      role: "user",
      nickName: "",
      location: "",
      gender: "",
      nationalId: "",
      isActive: false,
    };
    state.isAuth = false;
    state.loading = false;
  },
};
