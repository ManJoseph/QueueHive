package queuehive.queuehive.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import queuehive.queuehive.dto.DashboardOverviewDto;
import queuehive.queuehive.dto.TokenDto;
import queuehive.queuehive.dto.UserDto;
import queuehive.queuehive.service.SuperAdminService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
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

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = superAdminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        superAdminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tokens")
    public ResponseEntity<List<TokenDto>> getAllTokens() {
        List<TokenDto> tokens = superAdminService.getAllTokens();
        return ResponseEntity.ok(tokens);
    }
}
