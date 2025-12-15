package queuehive.queuehive.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import queuehive.queuehive.dto.CreateServiceTypeRequest;
import queuehive.queuehive.dto.ServiceTypeDto;
import queuehive.queuehive.dto.UpdateServiceTypeRequest; // Import UpdateServiceTypeRequest
import queuehive.queuehive.service.ServiceTypeService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/services") // Changed base path
public class ServiceTypeController {

    private final ServiceTypeService serviceTypeService;

    public ServiceTypeController(ServiceTypeService serviceTypeService) {
        this.serviceTypeService = serviceTypeService;
    }

    @PostMapping
    public ResponseEntity<ServiceTypeDto> addServiceToCompany(@Valid @RequestBody CreateServiceTypeRequest request) {
        // companyId will now come from the request body as per CreateServiceTypeRequest
        ServiceTypeDto newService = serviceTypeService.addServiceToCompany(request);
        return ResponseEntity.ok(newService);
    }

    @GetMapping("/company/{companyId}") // New endpoint for listing services by company
    public ResponseEntity<List<ServiceTypeDto>> listServicesForCompany(@PathVariable Long companyId) {
        List<ServiceTypeDto> services = serviceTypeService.listServices(companyId);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}") // New endpoint for fetching a single service by ID
    public ResponseEntity<ServiceTypeDto> getServiceTypeById(@PathVariable Long id) {
        ServiceTypeDto service = serviceTypeService.getServiceTypeById(id);
        return ResponseEntity.ok(service);
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceTypeDto> updateServiceType(@PathVariable Long serviceId, @Valid @RequestBody UpdateServiceTypeRequest request) {
        ServiceTypeDto updatedService = serviceTypeService.updateServiceType(serviceId, request);
        return ResponseEntity.ok(updatedService);
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deleteServiceType(@PathVariable Long serviceId) {
        serviceTypeService.deleteServiceType(serviceId);
        return ResponseEntity.noContent().build();
    }
}
