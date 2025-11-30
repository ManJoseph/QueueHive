package queuehive.queuehive.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "queue_sequence")
public class QueueSequence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceType serviceType;

    @Column(nullable = false)
    private Integer nextTokenNumber;

    public QueueSequence() {
    }

    public QueueSequence(ServiceType serviceType, Integer nextTokenNumber) {
        this.serviceType = serviceType;
        this.nextTokenNumber = nextTokenNumber;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public Integer getNextTokenNumber() {
        return nextTokenNumber;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public void setNextTokenNumber(Integer nextTokenNumber) {
        this.nextTokenNumber = nextTokenNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QueueSequence that = (QueueSequence) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "QueueSequence{" +
               "id=" + id +
               ", serviceType=" + (serviceType != null ? serviceType.getId() : "null") +
               ", nextTokenNumber=" + nextTokenNumber +
               '}';
    }
}
