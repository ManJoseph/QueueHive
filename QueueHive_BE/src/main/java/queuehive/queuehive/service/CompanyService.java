package queuehive.queuehive.service;

import queuehive.queuehive.dto.CompanyDto;
import queuehive.queuehive.dto.CreateCompanyRequest;

import java.util.List;

public interface CompanyService {
    CompanyDto registerCompany(CreateCompanyRequest request);
    CompanyDto approveCompany(Long companyId);
    List<CompanyDto> listApprovedCompanies();
}
