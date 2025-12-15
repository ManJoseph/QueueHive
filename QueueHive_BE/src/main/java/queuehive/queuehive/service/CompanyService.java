package queuehive.queuehive.service;

import queuehive.queuehive.dto.CompanyDto;
import queuehive.queuehive.dto.CreateCompanyRequest;
import queuehive.queuehive.dto.UpdateCompanyRequest;

import java.util.List;

public interface CompanyService {
    CompanyDto registerCompany(CreateCompanyRequest request);
    CompanyDto approveCompany(Long companyId);
    CompanyDto rejectCompany(Long companyId); // New method
    void deleteCompany(Long companyId);
    List<CompanyDto> listApprovedCompanies();
    List<CompanyDto> listAllCompanies(); // Get all companies regardless of status
    List<CompanyDto> listPendingCompanies(); // New method
    CompanyDto getCompanyById(Long companyId); // New method
    CompanyDto getCompanyByOwnerId(Long ownerId); // Get company by owner ID
    CompanyDto updateCompany(Long companyId, UpdateCompanyRequest request);
    
    // New methods for analytics
    Integer getDailyVisitors(Long companyId);
    // This could return a more complex DTO for full stats
    List<String> getQueueStats(Long companyId); 
}
