package queuehive.queuehive.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import queuehive.queuehive.dto.CompanyDto;
import queuehive.queuehive.dto.CreateCompanyRequest;
import queuehive.queuehive.service.CompanyService;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public ResponseEntity<CompanyDto> registerCompany(@Valid @RequestBody CreateCompanyRequest request) {
        CompanyDto newCompany = companyService.registerCompany(request);
        return ResponseEntity.ok(newCompany);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<CompanyDto> approveCompany(@PathVariable Long id) {
        CompanyDto approvedCompany = companyService.approveCompany(id);
        return ResponseEntity.ok(approvedCompany);
    }

    @GetMapping
    public ResponseEntity<List<CompanyDto>> listApprovedCompanies() {
        List<CompanyDto> companies = companyService.listApprovedCompanies();
        return ResponseEntity.ok(companies);
    }
}
