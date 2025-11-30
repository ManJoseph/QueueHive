package queuehive.queuehive.dto;

public class ServiceTypeDto {
    private Long id;
    private Long companyId;
    private String name;
    private Integer averageServiceTime;

    public ServiceTypeDto(Long id, Long companyId, String name, Integer averageServiceTime) {
        this.id = id;
        this.companyId = companyId;
        this.name = name;
        this.averageServiceTime = averageServiceTime;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

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
