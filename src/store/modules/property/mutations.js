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
  // Add this new mutation
  updateFirebaseProperty(state, { propertyId, updatedData }) {
    // Update the state if needed
    if (state.properties[propertyId]) {
      state.properties[propertyId] = updatedData;
    }
  },
};
