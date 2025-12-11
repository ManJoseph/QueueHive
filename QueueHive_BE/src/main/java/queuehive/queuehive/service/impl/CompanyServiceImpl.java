package queuehive.queuehive.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import queuehive.queuehive.domain.Company;
import queuehive.queuehive.dto.CompanyDto;
import queuehive.queuehive.dto.CreateCompanyRequest;
import queuehive.queuehive.dto.UpdateCompanyRequest;
import queuehive.queuehive.repository.CompanyRepository;
import queuehive.queuehive.repository.TokenRepository; // Import TokenRepository
import queuehive.queuehive.service.CompanyService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final TokenRepository tokenRepository; // Inject TokenRepository

    public CompanyServiceImpl(CompanyRepository companyRepository, TokenRepository tokenRepository) {
        this.companyRepository = companyRepository;
        this.tokenRepository = tokenRepository;
    }

    @Override
    public CompanyDto registerCompany(CreateCompanyRequest request) {
        Company company = new Company(
                request.getName(),
                request.getDescription(),
                request.getOwnerId(),
                false, // Initially not approved
                request.getLocation(),
                request.getCategory()
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
    @Transactional
    public CompanyDto rejectCompany(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + companyId));
        companyRepository.delete(company);
        // If we want to return a DTO for the rejected company, we can create one before deleting
        // For now, let's return the DTO of the company that was just deleted.
        return toDto(company);
    }

    @Override
    public List<CompanyDto> listApprovedCompanies() {
        return companyRepository.findByApproved(true).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CompanyDto> listPendingCompanies() {
        return companyRepository.findByApproved(false).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CompanyDto getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + companyId));
        return toDto(company);
    }

    @Override
    @Transactional
    public CompanyDto updateCompany(Long companyId, UpdateCompanyRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));


        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setLocation(request.getLocation());
        company.setCategory(request.getCategory());

        Company updatedCompany = companyRepository.save(company);
        return toDto(updatedCompany);
    }


    private CompanyDto toDto(Company company) {
        return new CompanyDto(
                company.getId(),
                company.getName(),
                company.getDescription(),
                company.getLocation(),
                company.getCategory(),
                company.getOwnerId(),
                company.getApproved(),
                company.getCreatedAt()
        );
    }

    @Override
    public Integer getDailyVisitors(Long companyId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        long visitors = tokenRepository.countByServiceTypeCompanyIdAndCreatedAtBetween(companyId, startOfDay, endOfDay);
        return (int) visitors;
    }

    @Override
    public List<String> getQueueStats(Long companyId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        long totalTokens = tokenRepository.countByServiceTypeCompanyIdAndCreatedAtBetween(companyId, startOfDay, endOfDay);
        long waitingTokens = tokenRepository.countByServiceTypeCompanyIdAndStatusInAndCreatedAtBetween(companyId, List.of("WAITING", "CALLING"), startOfDay, endOfDay);
        long completedTokens = tokenRepository.countByServiceTypeCompanyIdAndStatusInAndCreatedAtBetween(companyId, List.of("COMPLETED", "SERVED", "SKIPPED"), startOfDay, endOfDay);
        long cancelledTokens = tokenRepository.countByServiceTypeCompanyIdAndStatusAndCreatedAtBetween(companyId, "CANCELLED", startOfDay, endOfDay);


        return List.of(
            "Total Daily Tokens: " + totalTokens,
            "Waiting/Calling: " + waitingTokens,
            "Completed: " + completedTokens,
            "Cancelled: " + cancelledTokens
            // "Avg Wait Time: N/A (requires more complex calculation)" // Placeholder for now
        );
    }
}
