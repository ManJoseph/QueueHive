package queuehive.queuehive.dto;

public class LoginResponse {
    private String token;
    private String role;
    private Long userId;
    private Long companyId; // Nullable, only for COMPANY_ADMIN
    private String fullName; // User's full name for personalization

    // Constructor
    public LoginResponse(String token, String role, Long userId, Long companyId, String fullName) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.companyId = companyId;
        this.fullName = fullName;
    }

    // Overloaded constructor for users without company
    public LoginResponse(String token, String role, Long userId, String fullName) {
        this(token, role, userId, null, fullName);
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
