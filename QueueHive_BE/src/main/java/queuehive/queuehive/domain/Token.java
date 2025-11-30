package queuehive.queuehive.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "token_entity") // Avoids potential conflict with SQL keyword TOKEN
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceType serviceType;

    @Column(nullable = false)
    private Integer tokenNumber;

    @Column(nullable = false)
    private String status; // e.g., "PENDING", "CALLING", "COMPLETED", "CANCELLED"

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Token() {
    }

    public Token(User user, ServiceType serviceType, Integer tokenNumber, String status) {
        this.user = user;
        this.serviceType = serviceType;
        this.tokenNumber = tokenNumber;
        this.status = status;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public Integer getTokenNumber() {
        return tokenNumber;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public void setTokenNumber(Integer tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Token token = (Token) o;
        return Objects.equals(id, token.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Token{"
               + "id=" + id + ", "
               + "user=" + (user != null ? user.getId() : "null") + ", "
               + "serviceType=" + (serviceType != null ? serviceType.getId() : "null") + ", "
               + "tokenNumber=" + tokenNumber + ", "
               + "status='" + status + "'" + ", "
               + "createdAt=" + createdAt + 
               '}';
    }
}
