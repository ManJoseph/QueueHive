package queuehive.queuehive.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateServiceTypeRequest {
    @NotBlank(message = "Service name cannot be blank")
    private String name;

    @NotNull(message = "Average service time cannot be null")
    @Min(value = 1, message = "Average service time must be at least 1 minute")
    private Integer averageServiceTime;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAverageServiceTime() {
        return averageServiceTime;
    }

    public void setAverageServiceTime(Integer averageServiceTime) {
        this.averageServiceTime = averageServiceTime;
    }
}
