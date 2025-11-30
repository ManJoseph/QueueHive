import http from './http';

const companyApi = {
  getApprovedCompanies: () => {
    return http.get('/companies');
  },

  getServicesForCompany: (companyId) => {
    return http.get(`/companies/${companyId}/services`);
  },

  registerCompany: (companyData) => {
    return http.post('/companies', companyData);
  },

  approveCompany: (companyId) => {
    return http.put(`/companies/${companyId}/approve`);
  },
};

export default companyApi;
