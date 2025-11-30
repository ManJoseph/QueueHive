package queuehive.queuehive.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateCompanyRequest {
    @NotBlank(message = "Company name cannot be blank")
    private String name;

    @NotBlank(message = "Category cannot be blank")
    private String category;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
