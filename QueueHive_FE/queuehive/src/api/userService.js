import http from './http';

const getUserProfile = () => {
  return http.get('/users/me');
};

const updateUserProfile = (userId, userData) => {
  return http.put(`/users/${userId}/update`, userData); // Assuming backend endpoint is /users/{userId}/update
};

const updateUserPassword = (userId, passwordData) => {
    return http.put(`/users/${userId}/update-password`, passwordData); // Assuming backend endpoint is /users/{userId}/update-password
};

const userService = {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
};

export default userService;
