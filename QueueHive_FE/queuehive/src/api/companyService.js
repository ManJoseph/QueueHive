import http from './http';

const getApprovedCompanies = () => {
  return http.get('/companies');
};

const getServicesForCompany = (companyId) => {
  return http.get(`/services/company/${companyId}`);
};

const registerCompany = (companyData) => {
  return http.post('/companies', companyData);
};

const getCompanyByOwnerId = (ownerId) => {
  return http.get(`/companies/owner/${ownerId}`);
};

const getPendingCompanies = () => {
  return http.get('/companies/pending');
};

const approveCompany = (companyId) => {
  return http.put(`/companies/${companyId}/approve`);
};

const rejectCompany = (companyId) => {
  return http.delete(`/companies/${companyId}/reject`);
};

const getCompanyById = (companyId) => {
  return http.get(`/companies/${companyId}`);
};

const companyService = {
  getApprovedCompanies,
  getServicesForCompany,
  registerCompany,
  getCompanyByOwnerId,
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  getCompanyById,
};

export default companyService;
