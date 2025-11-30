package queuehive.queuehive.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import queuehive.queuehive.dto.CreateServiceTypeRequest;
import queuehive.queuehive.dto.ServiceTypeDto;
import queuehive.queuehive.service.ServiceTypeService;

import java.util.List;

@RestController
@RequestMapping("/api/companies/{companyId}/services")
public class ServiceTypeController {

    private final ServiceTypeService serviceTypeService;

    public ServiceTypeController(ServiceTypeService serviceTypeService) {
        this.serviceTypeService = serviceTypeService;
    }

    @PostMapping
    public ResponseEntity<ServiceTypeDto> addServiceToCompany(@PathVariable Long companyId, @Valid @RequestBody CreateServiceTypeRequest request) {
        // Ensure the companyId in the path matches the one in the request body for consistency
        request.setCompanyId(companyId);
        ServiceTypeDto newService = serviceTypeService.addServiceToCompany(request);
        return ResponseEntity.ok(newService);
    }

    @GetMapping
    public ResponseEntity<List<ServiceTypeDto>> listServicesForCompany(@PathVariable Long companyId) {
        List<ServiceTypeDto> services = serviceTypeService.listServices(companyId);
        return ResponseEntity.ok(services);
    }
}
