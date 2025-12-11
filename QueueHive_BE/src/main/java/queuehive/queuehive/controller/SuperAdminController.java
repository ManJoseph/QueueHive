package queuehive.queuehive.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import queuehive.queuehive.dto.DashboardOverviewDto;
import queuehive.queuehive.service.SuperAdminService;

@RestController
@RequestMapping("/api/superadmin")
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    public SuperAdminController(SuperAdminService superAdminService) {
        this.superAdminService = superAdminService;
    }

    @GetMapping("/dashboard/overview")
    public ResponseEntity<DashboardOverviewDto> getDashboardOverview() {
        DashboardOverviewDto overviewDto = superAdminService.getDashboardOverview();
        return ResponseEntity.ok(overviewDto);
    }
}
