package queuehive.queuehive.dto;

public class LoginResponse {
    private String token;
    private String role;
    private Long userId;
    private Long companyId; // New field, optional

    public LoginResponse(String token, String role, Long userId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
    }

    public LoginResponse(String token, String role, Long userId, Long companyId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.companyId = companyId;
    }

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
}
