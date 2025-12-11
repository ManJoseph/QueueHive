package queuehive.queuehive.service.impl;

import org.springframework.stereotype.Service;
import queuehive.queuehive.dto.DashboardOverviewDto;
import queuehive.queuehive.repository.CompanyRepository;
import queuehive.queuehive.repository.TokenRepository;
import queuehive.queuehive.repository.UserRepository;
import queuehive.queuehive.service.SuperAdminService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
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
        long approvedCompanies = companyRepository.countByApproved(true);
        long pendingCompanies = companyRepository.countByApproved(false);
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
}
