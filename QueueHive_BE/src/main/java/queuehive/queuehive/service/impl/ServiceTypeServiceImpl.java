package queuehive.queuehive.service.impl;

import org.springframework.stereotype.Service;
import queuehive.queuehive.domain.Company;
import queuehive.queuehive.domain.ServiceType;
import queuehive.queuehive.dto.CreateServiceTypeRequest;
import queuehive.queuehive.dto.ServiceTypeDto;
import queuehive.queuehive.repository.CompanyRepository;
import queuehive.queuehive.repository.ServiceTypeRepository;
import queuehive.queuehive.service.ServiceTypeService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceTypeServiceImpl implements ServiceTypeService {

    private final ServiceTypeRepository serviceTypeRepository;
    private final CompanyRepository companyRepository;

    public ServiceTypeServiceImpl(ServiceTypeRepository serviceTypeRepository, CompanyRepository companyRepository) {
        this.serviceTypeRepository = serviceTypeRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    public ServiceTypeDto addServiceToCompany(CreateServiceTypeRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        ServiceType serviceType = new ServiceType(
                company,
                request.getName(),
                request.getAverageServiceTime()
        );
        ServiceType savedServiceType = serviceTypeRepository.save(serviceType);
        return toDto(savedServiceType);
    }

    @Override
    public List<ServiceTypeDto> listServices(Long companyId) {
        return serviceTypeRepository.findByCompanyId(companyId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ServiceTypeDto toDto(ServiceType serviceType) {
        return new ServiceTypeDto(
                serviceType.getId(),
                serviceType.getCompany().getId(),
                serviceType.getName(),
                serviceType.getAverageServiceTime()
        );
    }
}
