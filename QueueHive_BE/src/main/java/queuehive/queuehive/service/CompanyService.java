package queuehive.queuehive.service;

import queuehive.queuehive.dto.CompanyDto;
import queuehive.queuehive.dto.CreateCompanyRequest;
import queuehive.queuehive.dto.UpdateCompanyRequest; // Import UpdateCompanyRequest

import java.util.List;

public interface CompanyService {
    CompanyDto registerCompany(CreateCompanyRequest request);
    CompanyDto approveCompany(Long companyId);
    List<CompanyDto> listApprovedCompanies();
    CompanyDto updateCompany(Long companyId, UpdateCompanyRequest request);
    
    // New methods for analytics
    Integer getDailyVisitors(Long companyId);
    // This could return a more complex DTO for full stats
    List<String> getQueueStats(Long companyId); 
}
