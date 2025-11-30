package queuehive.queuehive.repository;

import queuehive.queuehive.domain.QueueSequence;
import queuehive.queuehive.domain.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QueueSequenceRepository extends JpaRepository<QueueSequence, Long> {
    Optional<QueueSequence> findByServiceType(ServiceType serviceType);
}
