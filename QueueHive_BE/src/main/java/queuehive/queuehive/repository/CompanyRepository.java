package queuehive.queuehive.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import queuehive.queuehive.domain.Company;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByApproved(boolean approved);
    long countByApproved(boolean approved);
    Optional<Company> findByOwnerId(Long ownerId); // New method
}
