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
  setProperty(state, payload) {
    state.property = payload;
  },
  // Add this new mutation
  updateFirebaseProperty(state, { propertyId, updatedData }) {
    // Find and update the property in the properties array
    if (state.properties && Array.isArray(state.properties)) {
      const index = state.properties.findIndex(
        (prop) => prop.id === propertyId
      );
      if (index !== -1) {
        state.properties[index] = {
          ...state.properties[index],
          ...updatedData,
        };
      }
    }
    // Also update propertyDetails if it's the same property
    if (state.property && state.property.id === propertyId) {
      state.property = { ...state.property, ...updatedData };
    }
  },
  deleteProperty(state, propertyId) {
    // Convert properties object to array if it's not already
    const propertiesArray = Array.isArray(state.properties)
      ? state.properties
      : Object.values(state.properties);

    state.properties = propertiesArray.filter(
      (property) => property.id !== propertyId
    );
  },
};
