export default {
  updateProperty(state, payload) {
    state.propertyDetails = { ...state.propertyDetails, ...payload };
    localStorage.setItem(
      "propertyDetails",
      JSON.stringify(state.propertyDetails)
    );
  },
};
