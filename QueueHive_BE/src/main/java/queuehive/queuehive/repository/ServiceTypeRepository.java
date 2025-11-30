package queuehive.queuehive.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import queuehive.queuehive.domain.ServiceType;

public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {
}
