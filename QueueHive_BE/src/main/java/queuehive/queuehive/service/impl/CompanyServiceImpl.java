package queuehive.queuehive.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import queuehive.queuehive.domain.Company;
import queuehive.queuehive.dto.CompanyDto;
import queuehive.queuehive.dto.CreateCompanyRequest;
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
                request.getCategory(),
                false // Initially not approved
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

    private CompanyDto toDto(Company company) {
        return new CompanyDto(
                company.getId(),
                company.getName(),
                company.getCategory(),
                company.getApproved(),
                company.getCreatedAt()
        );
    }
}
