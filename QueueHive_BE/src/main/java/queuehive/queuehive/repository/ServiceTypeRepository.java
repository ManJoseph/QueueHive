package queuehive.queuehive.repository;

import queuehive.queuehive.domain.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {
    List<ServiceType> findByCompanyId(Long companyId);
}
