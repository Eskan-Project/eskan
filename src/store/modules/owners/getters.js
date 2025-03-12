export default {
  owners: (state) => {
    return state.owners ? state.owners.filter(owner => owner.role === "owner") : [];
  },
  ownerInfo: (state) => state.ownerInfo,
  ownerRole: (state) => state.ownerInfo.role,
  isActive: (state) => state.ownerInfo.isActive,
  // paidProperties: (state) => state.userInfo.paidProperties,
  // freePropertyViewed: (state) => state.userInfo.freePropertyViewed,
  ownerPhoto: (state) => state.ownerInfo.photo,
  error: (state) => state.error,
};
