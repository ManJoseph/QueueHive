import http from './http';

const getDashboardOverview = () => {
  return http.get('/superadmin/dashboard/overview');
};

const superAdminService = {
  getDashboardOverview,
};

export default superAdminService;
