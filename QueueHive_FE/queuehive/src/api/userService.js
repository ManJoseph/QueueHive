import http from './http';

const getProfile = () => {
  return http.get('/users/me');
};

const updateProfile = (userData) => {
  return http.put('/users/update', userData);
};

const updatePassword = (userId, passwordData) => {
  return http.put(`/users/${userId}/update-password`, passwordData);
};

const userService = {
  getProfile,
  updateProfile,
  updatePassword,
};

export default userService;
