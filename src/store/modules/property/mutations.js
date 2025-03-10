export default {
  setProperties(state, payload) {
    state.properties = { id: "", ...payload };
  },
  updateProperty(state, payload) {
    state.propertyDetails = { ...state.propertyDetails, ...payload };
    localStorage.setItem(
      "propertyDetails",
      JSON.stringify(state.propertyDetails)
    );
  },
  setProperty(state, payload) {
    state.property = payload;
  },
};
