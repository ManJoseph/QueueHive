import http from './http';

const login = async (credentials) => {
  const response = await http.post('/auth/login', credentials);
  return response.data;
};

const register = (userData) => {
  return http.post('/auth/register', userData);
};

const registerCompany = (companyAdminData) => {
  return http.post('/auth/register-company', companyAdminData);
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole'); // Remove userRole on logout
  localStorage.removeItem('userId'); // Remove userId on logout
};

const authService = {
  login,
  register,
  registerCompany,
  logout,
};

export default authService;
