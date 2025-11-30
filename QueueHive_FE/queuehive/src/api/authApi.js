import http from './http';

const authApi = {
  register: (userData) => {
    return http.post('/auth/register', userData);
  },

  login: (credentials) => {
    return http.post('/auth/login', credentials);
  },
};

export default authApi;
