import http from './http';

const getAllUsers = () => {
  return http.get('/superadmin/users');
};

const deleteUser = (userId) => {
  return http.delete(`/superadmin/users/${userId}`);
};

const getAllTokens = () => {
  return http.get('/superadmin/tokens');
};

const adminService = {
  getAllUsers,
  deleteUser,
  getAllTokens,
};

export default adminService;
