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
  return http.put(`/companies/${companyId}/reject`);
};

const deleteCompany = (companyId) => {
  return http.delete(`/companies/${companyId}`);
};

const getCompanyById = (companyId) => {
  return http.get(`/companies/${companyId}`);
};

const getAllCompanies = () => {
  return http.get('/companies/all');
};

const companyService = {
  getApprovedCompanies,
  getAllCompanies,
  getServicesForCompany,
  registerCompany,
  getCompanyByOwnerId,
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  deleteCompany,
  getCompanyById,
};

export default companyService;
