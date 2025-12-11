import http from './http';

const getCompanyProfile = (companyId) => {
  return http.get(`/companies/${companyId}`);
};

const updateCompanyProfile = (companyId, companyData) => {
  return http.put(`/companies/${companyId}/update`, companyData);
};

const getCompanyServices = (companyId) => {
  return http.get(`/services/company/${companyId}`);
};

const getServiceById = (serviceId) => {
  return http.get(`/services/${serviceId}`);
};

const addService = (serviceData) => {
  return http.post('/services', serviceData);
};

const updateService = (serviceId, serviceData) => {
  return http.put(`/services/${serviceId}`, serviceData);
};

const deleteService = (serviceId) => {
  return http.delete(`/services/${serviceId}`);
};

const getActiveQueueCustomers = (serviceId) => {
  return http.get(`/tokens/service/${serviceId}/active`);
};

const updateCustomerTokenStatus = (tokenId, status) => {
  return http.put(`/tokens/${tokenId}/status`, null, { params: { status } });
};

const callNextToken = (serviceId) => {
  return http.post(`/tokens/service/${serviceId}/call-next`);
};

const markTokenServed = (tokenId) => {
  return http.put(`/tokens/${tokenId}/mark-served`);
};

const skipToken = (tokenId) => {
  return http.put(`/tokens/${tokenId}/skip`);
};

const cancelToken = (tokenId) => {
  return http.put(`/tokens/${tokenId}/cancel`);
};

const getDailyVisitors = (companyId) => {
  return http.get(`/companies/${companyId}/analytics/daily-visitors`);
};

const getQueueStats = (companyId) => {
  return http.get(`/companies/${companyId}/analytics/queue-stats`);
};

const companyAdminService = {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
  getActiveQueueCustomers,
  callNextToken,
  markTokenServed,
  skipToken,
  cancelToken,
  getDailyVisitors,
  getQueueStats,
};

export default companyAdminService;
