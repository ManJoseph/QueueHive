package queuehive.queuehive.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import queuehive.queuehive.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
