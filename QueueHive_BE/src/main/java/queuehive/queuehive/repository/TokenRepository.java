package queuehive.queuehive.repository;

import queuehive.queuehive.domain.ServiceType;
import queuehive.queuehive.domain.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    long countByServiceTypeAndStatusInAndCreatedAtBefore(
        ServiceType serviceType, List<String> statuses, LocalDateTime createdAt);

    List<Token> findByUserIdAndStatusIn(Long userId, List<String> statuses);
    List<Token> findByUserIdOrderByCreatedAtDesc(Long userId); // Get all tokens for a user

    List<Token> findByServiceTypeIdAndStatusInOrderByCreatedAtAsc(Long serviceTypeId, List<String> statuses);

    // New methods for analytics
    long countByServiceTypeCompanyIdAndStatusAndCreatedAtBetween(Long companyId, String status, LocalDateTime startOfDay, LocalDateTime endOfDay);
    long countByServiceTypeCompanyIdAndCreatedAtBetween(Long companyId, LocalDateTime startOfDay, LocalDateTime endOfDay);
    long countByServiceTypeCompanyIdAndStatusInAndCreatedAtBetween(Long companyId, List<String> statuses, LocalDateTime startOfDay, LocalDateTime endOfDay);

    // New method to find the next pending token
    Optional<Token> findFirstByServiceTypeIdAndStatusOrderByCreatedAtAsc(Long serviceTypeId, String status);

    // New methods for dashboard analytics
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countDistinctServiceTypeIdByStatusInAndCreatedAtBetween(List<String> statuses, LocalDateTime start, LocalDateTime end);
}
