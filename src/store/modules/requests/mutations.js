export default {
  setRequests(state, requests) {
    state.requests = requests;
  },
  setRequestInfo(state, requestInfo) {
    state.requestInfo = {
      ...state.requestInfo,
      ...requestInfo,
    };
  },
  updateRequestInfo(state, updates) {
    state.requestInfo = {
      ...state.requestInfo,
      ...updates,
    };
  },
  resetRequestInfo(state) {
    state.requestInfo = {};
  },
  setError(state, error) {
    state.error = error;
  },
  clearError(state) {
    state.error = null;
  },
};
