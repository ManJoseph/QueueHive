package queuehive.queuehive.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import queuehive.queuehive.domain.Company;
import queuehive.queuehive.dto.CompanyDto;
import queuehive.queuehive.dto.CreateCompanyRequest;
import queuehive.queuehive.repository.CompanyRepository;
import queuehive.queuehive.service.impl.CompanyServiceImpl;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompanyServiceImplTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyServiceImpl companyService;

    @Test
    void shouldRegisterCompanyWithPendingApproval() {
        // Given
        CreateCompanyRequest request = new CreateCompanyRequest();
        request.setName("Test Company");
        request.setCategory("Tech");

        Company companyToSave = new Company(request.getName(), request.getCategory(), false);
        Company savedCompany = new Company(request.getName(), request.getCategory(), false);
        savedCompany.setId(1L);

        when(companyRepository.save(any(Company.class))).thenReturn(savedCompany);

        // When
        CompanyDto result = companyService.registerCompany(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo(request.getName());
        assertThat(result.getApproved()).isFalse();
        verify(companyRepository).save(any(Company.class));
    }

    @Test
    void shouldApproveCompany() {
        // Given
        Long companyId = 1L;
        Company existingCompany = new Company("Test Company", "Tech", false);
        existingCompany.setId(companyId);

        when(companyRepository.findById(companyId)).thenReturn(Optional.of(existingCompany));
        when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        CompanyDto result = companyService.approveCompany(companyId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(companyId);
        assertThat(result.getApproved()).isTrue();
        verify(companyRepository).findById(companyId);
        verify(companyRepository).save(any(Company.class));
    }
}
