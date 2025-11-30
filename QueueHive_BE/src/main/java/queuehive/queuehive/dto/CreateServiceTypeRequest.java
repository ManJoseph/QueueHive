package queuehive.queuehive.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateServiceTypeRequest {
    @NotNull(message = "Company ID cannot be null")
    private Long companyId;

    @NotBlank(message = "Service name cannot be blank")
    private String name;

    @NotNull(message = "Average service time cannot be null")
    @Positive(message = "Average service time must be positive")
    private Integer averageServiceTime;

    // Getters and Setters
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAverageServiceTime() { return averageServiceTime; }
    public void setAverageServiceTime(Integer averageServiceTime) { this.averageServiceTime = averageServiceTime; }
}
