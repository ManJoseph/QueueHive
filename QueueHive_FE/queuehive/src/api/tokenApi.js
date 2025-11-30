import http from './http';

const tokenApi = {
  createToken: (userId, serviceId) => {
    return http.post('/tokens', { userId, serviceId });
  },

  getTokenStatus: (tokenId) => {
    return http.get(`/tokens/${tokenId}`);
  },

  getQueuePosition: (tokenId) => {
    return http.get(`/tokens/${tokenId}/position`);
  },
};

export default tokenApi;
