package queuehive.queuehive.service;

import queuehive.queuehive.dto.CreateServiceTypeRequest;
import queuehive.queuehive.dto.ServiceTypeDto;

import java.util.List;

public interface ServiceTypeService {
    ServiceTypeDto addServiceToCompany(CreateServiceTypeRequest request);
    List<ServiceTypeDto> listServices(Long companyId);
}
