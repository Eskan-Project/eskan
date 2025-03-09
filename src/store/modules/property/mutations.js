export default {
  setProperties(state, payload) {
    state.properties = payload;
  },
  updateProperty(state, payload) {
    state.propertyDetails = { ...state.propertyDetails, ...payload };
    localStorage.setItem(
      "propertyDetails",
      JSON.stringify(state.propertyDetails)
    );
  },
};
