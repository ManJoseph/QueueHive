import http from './http';

const getUserProfile = () => {
  return http.get('/users/me');
};

const updateUserProfile = (userData) => {
  return http.put('/users/update', userData);
};

const userService = {
  getUserProfile,
  updateUserProfile,
};

export default userService;
