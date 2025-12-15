package queuehive.queuehive.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import queuehive.queuehive.domain.Company;
import queuehive.queuehive.domain.CompanyStatus;
import queuehive.queuehive.dto.CompanyDto;
import queuehive.queuehive.dto.CreateCompanyRequest;
import queuehive.queuehive.repository.CompanyRepository;
import queuehive.queuehive.repository.UserRepository;
import queuehive.queuehive.service.impl.CompanyServiceImpl;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("CompanyService Tests")
class CompanyServiceImplTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CompanyServiceImpl companyService;

    private CreateCompanyRequest createCompanyRequest;
    private Company company;
    private queuehive.queuehive.domain.User user;

    @BeforeEach
    void setUp() {
        createCompanyRequest = new CreateCompanyRequest();
        createCompanyRequest.setName("Test Company");
        createCompanyRequest.setDescription("A company for testing");
        createCompanyRequest.setOwnerId(1L);
        createCompanyRequest.setLocation("Test Location");
        createCompanyRequest.setCategory("Test Category");

        company = new Company(
            createCompanyRequest.getName(),
            createCompanyRequest.getDescription(),
            createCompanyRequest.getOwnerId(),
            CompanyStatus.PENDING,
            createCompanyRequest.getLocation(),
            createCompanyRequest.getCategory()
        );
        company.setId(1L);

        user = new queuehive.queuehive.domain.User();
        user.setId(1L);
        user.setEmail("test@example.com");
    }

    @Test
    @DisplayName("shouldRegisterCompanyWithPendingStatus")
    void shouldRegisterCompanyWithPendingStatus() {
        // Given
        when(companyRepository.save(any(Company.class))).thenReturn(company);
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(user));

        // When
        CompanyDto result = companyService.registerCompany(createCompanyRequest);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo(createCompanyRequest.getName());
        assertThat(result.getApproved()).isFalse(); // PENDING status should result in approved being false
    }

    @Test
    @DisplayName("shouldApproveCompany")
    void shouldApproveCompany() {
        // Given
        when(companyRepository.findById(company.getId())).thenReturn(Optional.of(company));
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(user));
        when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> {
            Company savedCompany = invocation.getArgument(0);
            savedCompany.setStatus(CompanyStatus.APPROVED);
            return savedCompany;
        });

        // When
        CompanyDto result = companyService.approveCompany(company.getId());

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(company.getId());
        assertThat(result.getApproved()).isTrue();
    }

    @Test
    @DisplayName("shouldRejectCompany")
    void shouldRejectCompany() {
        // Given
        when(companyRepository.findById(company.getId())).thenReturn(Optional.of(company));
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(user));
                when(companyRepository.save(any(Company.class))).thenAnswer(invocation -> {
                    Company savedCompany = invocation.getArgument(0);
                    savedCompany.setStatus(CompanyStatus.REJECTED);
                    return savedCompany;
                });
        // When
        CompanyDto result = companyService.rejectCompany(company.getId());

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(company.getId());
        assertThat(result.getApproved()).isFalse(); // REJECTED status should result in approved being false
    }
}
