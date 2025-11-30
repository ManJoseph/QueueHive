package queuehive.queuehive.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import queuehive.queuehive.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
