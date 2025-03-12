export default {
  // Add getter for users array
  requests: (state) => state.requests,
  requestInfo: (state) => state.requestInfo,
  requestImages: (state) => state.requestInfo.images,
  requestStatus: (state) => state.request.status,
  requestPropertyContact: (state) => state.request.propertyContact,
  error: (state) => state.error,
};
