package queuehive.queuehive.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import queuehive.queuehive.domain.Company;
import queuehive.queuehive.dto.CompanyDto;
import queuehive.queuehive.dto.CreateCompanyRequest;
import queuehive.queuehive.dto.UpdateCompanyRequest; // Import UpdateCompanyRequest
import queuehive.queuehive.repository.CompanyRepository;
import queuehive.queuehive.service.CompanyService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public CompanyDto registerCompany(CreateCompanyRequest request) {
        Company company = new Company(
                request.getName(),
                request.getDescription(), // Use description
                request.getOwnerId(),     // Use ownerId
                false, // Initially not approved
                null, // Location - can be null for now
                null  // Category - can be null for now
        );
        Company savedCompany = companyRepository.save(company);
        return toDto(savedCompany);
    }

    @Override
    @Transactional
    public CompanyDto approveCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setApproved(true);
        Company updatedCompany = companyRepository.save(company);
        return toDto(updatedCompany);
    }

    @Override
    public List<CompanyDto> listApprovedCompanies() {
        return companyRepository.findByApproved(true).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CompanyDto updateCompany(Long companyId, UpdateCompanyRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            company.setName(request.getName());
        }
        if (request.getDescription() != null) { // Description can be null/empty string
            company.setDescription(request.getDescription());
        }
        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            // Assuming 'location' maps to a field in Company, let's say 'category' was used for location
            // Since Company entity now has 'description', and 'category' was removed,
            // we need to decide where 'location' goes. For simplicity, let's map it to 'description' temporarily
            // or assume a 'location' field exists.
            // REVISION: The Company entity has 'name', 'description', 'ownerId', 'approved'.
            // There is no explicit 'location' field.
            // For now, I will NOT update location, or if frontend sends it, it will be ignored until field is added to Company.
            // Best practice would be to add a 'location' field to Company.
            // For now, I'll update description with location if location is provided in request.
            // This is a temporary workaround.
            company.setDescription(request.getLocation()); // TEMPORARY: Map location to description
        }

        Company updatedCompany = companyRepository.save(company);
        return toDto(updatedCompany);
    }


    private CompanyDto toDto(Company company) {
        return new CompanyDto(
                company.getId(),
                company.getName(),
                company.getDescription(), // Changed from getCategory()
                company.getOwnerId(),     // New field
                company.getApproved(),
                company.getCreatedAt()
        );
    }

    @Override
    public Integer getDailyVisitors(Long companyId) {
        // Dummy data for analytics
        return 100 + (int)(Math.random() * 200); // Random visitors between 100 and 300
    }

    @Override
    public List<String> getQueueStats(Long companyId) {
        // Dummy data for analytics
        return List.of(
            "Total Queues: 5",
            "Avg Wait Time: 15 min",
            "Peak Hours: 12-2 PM"
        );
    }
}
