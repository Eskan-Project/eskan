export default {
  setOwner(state, owner) {
    state.owner = owner;
  },
  setOwners(state, owners) {
    state.owners = owners;
  },
  setOwnerInfo(state, ownerInfo) {
    state.ownerInfo = {
      ...state.ownerInfo, // Changed from owner.ownerInfo to state.ownerInfo
      ...ownerInfo,
    };
  },
  updateOwnerInfo(state, updates) {
    state.ownerInfo = {
      ...state.ownerInfo,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  },

  // incrementFreePropertyViewed(state) {
  //   state.userInfo.freePropertyViewed =
  //     (state.userInfo.freePropertyViewed || 0) + 1;
  // },

  // addPaidProperty(state, propertyId) {
  //   if (!state.userInfo.paidProperties.includes(propertyId)) {
  //     state.userInfo.paidProperties.push(propertyId);
  //   }
  // },

  setError(state, error) {
    state.error = error;
  },

  clearError(state) {
    state.error = "";
  },

  resetOwnerInfo(state) {
    state.ownerInfo = {
      createdAt: "",
      email: "",
      idImage: "",
      gender: "",
      isActive: true,
      location: "",
      name: "",
      nationalId: "",
      nickName: "",
      photo: "",
      role: "owner",
      uid: "",
      updatedAt: "",
    };
  },
};
