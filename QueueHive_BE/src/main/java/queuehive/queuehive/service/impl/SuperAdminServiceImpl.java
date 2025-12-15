package queuehive.queuehive.service.impl;

import org.springframework.stereotype.Service;
import queuehive.queuehive.domain.CompanyStatus;
import queuehive.queuehive.dto.DashboardOverviewDto;
import queuehive.queuehive.dto.TokenDto;
import queuehive.queuehive.dto.UserDto;
import queuehive.queuehive.repository.CompanyRepository;
import queuehive.queuehive.repository.TokenRepository;
import queuehive.queuehive.repository.UserRepository;
import queuehive.queuehive.service.SuperAdminService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SuperAdminServiceImpl implements SuperAdminService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    public SuperAdminServiceImpl(CompanyRepository companyRepository, UserRepository userRepository, TokenRepository tokenRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    @Override
    public DashboardOverviewDto getDashboardOverview() {
        long totalCompanies = companyRepository.count();
        long approvedCompanies = companyRepository.countByStatus(CompanyStatus.APPROVED);
        long pendingCompanies = companyRepository.countByStatus(CompanyStatus.PENDING);
        long totalUsers = userRepository.count();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        long totalTokensToday = tokenRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        long activeQueues = tokenRepository.countDistinctServiceTypeIdByStatusInAndCreatedAtBetween(
                java.util.List.of("WAITING", "CALLING"), startOfDay, endOfDay
        );

        // Dummy data for traffic charts
        Map<String, Long> dailyTraffic = new HashMap<>();
        dailyTraffic.put("Today", totalTokensToday);
        Map<String, Long> weeklyTraffic = new HashMap<>();
        weeklyTraffic.put("This Week", 1200L);
        Map<String, Long> monthlyTraffic = new HashMap<>();
        monthlyTraffic.put("This Month", 5000L);

        String systemHealth = "HEALTHY";

        return new DashboardOverviewDto(
                totalCompanies,
                approvedCompanies,
                pendingCompanies,
                totalUsers,
                totalTokensToday,
                activeQueues,
                dailyTraffic,
                weeklyTraffic,
                monthlyTraffic,
                systemHealth
        );
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), user.getRole(), user.getCreatedAt()))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public List<TokenDto> getAllTokens() {
        return tokenRepository.findAll().stream()
                .map(token -> new TokenDto(
                        token.getId(),
                        token.getUser().getId(),
                        token.getServiceType().getId(),
                        token.getTokenNumber(),
                        token.getStatus(),
                        token.getCreatedAt(),
                        new queuehive.queuehive.dto.ServiceTypeDto(
                                token.getServiceType().getId(),
                                token.getServiceType().getCompany().getId(),
                                token.getServiceType().getCompany().getName(),
                                token.getServiceType().getName(),
                                token.getServiceType().getDescription(),
                                token.getServiceType().getAverageServiceTime()
                        )
                ))
                .collect(java.util.stream.Collectors.toList());
    }
}
