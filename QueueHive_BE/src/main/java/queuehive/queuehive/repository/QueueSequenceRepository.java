package queuehive.queuehive.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import queuehive.queuehive.domain.QueueSequence;

public interface QueueSequenceRepository extends JpaRepository<QueueSequence, Long> {
}
