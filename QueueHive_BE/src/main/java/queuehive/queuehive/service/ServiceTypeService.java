package queuehive.queuehive.service;

import queuehive.queuehive.dto.CreateServiceTypeRequest;
import queuehive.queuehive.dto.ServiceTypeDto;
import queuehive.queuehive.dto.UpdateServiceTypeRequest;

import java.util.List;

public interface ServiceTypeService {
    ServiceTypeDto addServiceToCompany(CreateServiceTypeRequest request);
    List<ServiceTypeDto> listServices(Long companyId);
    ServiceTypeDto getServiceTypeById(Long serviceId); // New method
    ServiceTypeDto updateServiceType(Long serviceId, UpdateServiceTypeRequest request); // New
    void deleteServiceType(Long serviceId); // New
}
