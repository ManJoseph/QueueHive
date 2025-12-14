import http from './http';

const createToken = (userId, serviceId) => {
  return http.post('/tokens', { userId, serviceId });
};

const getTokenStatus = (tokenId) => {
  return http.get(`/tokens/${tokenId}`);
};

const getQueuePosition = (tokenId) => {
  return http.get(`/tokens/${tokenId}/position`);
};

const getTokensByUserId = (userId) => {
  return http.get(`/tokens/user/${userId}`);
};

const tokenService = {
  createToken,
  getTokenStatus,
  getQueuePosition,
  getTokensByUserId,
};

export default tokenService;
