package queuehive.queuehive.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;
import queuehive.queuehive.domain.CompanyStatus;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "company")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column // description is now optional
    private String description;

    @Column(nullable = false)
    private Long ownerId; // Foreign key to User id

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(255) DEFAULT 'PENDING'")
    private CompanyStatus status;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean approved = false;

    @Column
    private String location;

    @Column
    private String category;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Company() {
    }

    public Company(String name, String description, Long ownerId, CompanyStatus status, String location, String category) {
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.status = status;
        this.location = location;
        this.category = category;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public CompanyStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getLocation() {
        return location;
    }

    public String getCategory() {
        return category;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public void setStatus(CompanyStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Company company = (Company) o;
        return Objects.equals(id, company.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Company{"
               + "id=" + id + ", "
               + "name='" + name + "'" + ", "
               + "description='" + description + "'" + ", "
               + "ownerId=" + ownerId + ", "
               + "status=" + status + ", "
               + "location='" + location + "'" + ", "
               + "category='" + category + "'" + ", "
               + "createdAt=" + createdAt +
               '}';
    }
}
