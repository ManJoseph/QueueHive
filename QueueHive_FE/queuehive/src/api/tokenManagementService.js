import http from './http';

const API_URL = '/tokens';

const tokenManagementService = {
  // Get all tokens for a specific service
  getTokensByService: (serviceId) => {
    return http.get(`${API_URL}/service/${serviceId}/active`);
  },

  // Call next token in queue
  callNextToken: (serviceId) => {
    return http.post(`${API_URL}/service/${serviceId}/call-next`);
  },

  // Mark token as served
  markTokenServed: (tokenId) => {
    return http.put(`${API_URL}/${tokenId}/mark-served`);
  },

  // Skip a token
  skipToken: (tokenId) => {
    return http.put(`${API_URL}/${tokenId}/skip`);
  },

  // Cancel a token
  cancelToken: (tokenId) => {
    return http.put(`${API_URL}/${tokenId}/cancel`);
  },

  // Update token status
  updateTokenStatus: (tokenId, status) => {
    return http.put(`${API_URL}/${tokenId}/status`, null, {
      params: { status }
    });
  },

  // Get token by ID
  getTokenById: (tokenId) => {
    return http.get(`${API_URL}/${tokenId}`);
  }
};

export default tokenManagementService;
