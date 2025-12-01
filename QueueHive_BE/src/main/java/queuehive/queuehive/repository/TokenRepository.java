package queuehive.queuehive.repository;

import queuehive.queuehive.domain.ServiceType;
import queuehive.queuehive.domain.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Long> {
    long countByServiceTypeAndStatusInAndCreatedAtBefore(
        ServiceType serviceType, List<String> statuses, LocalDateTime createdAt);
    
    List<Token> findByUserIdAndStatusIn(Long userId, List<String> statuses);

    List<Token> findByServiceTypeIdAndStatusInOrderByCreatedAtAsc(Long serviceTypeId, List<String> statuses); // New method
}
