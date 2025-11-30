package queuehive.queuehive.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import queuehive.queuehive.domain.Token;

public interface TokenRepository extends JpaRepository<Token, Long> {
}
