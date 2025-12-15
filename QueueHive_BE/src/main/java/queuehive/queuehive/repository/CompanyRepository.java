package queuehive.queuehive.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import queuehive.queuehive.domain.Company;
import queuehive.queuehive.domain.CompanyStatus;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByStatus(CompanyStatus status);
    long countByStatus(CompanyStatus status);
    Optional<Company> findByOwnerId(Long ownerId); // New method
}
