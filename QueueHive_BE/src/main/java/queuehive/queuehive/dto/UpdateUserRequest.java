package queuehive.queuehive.dto;

import jakarta.validation.constraints.Size;

public class UpdateUserRequest {
    private String fullName;
    private String phoneNumber;
    private String currentPassword;

    @Size(min = 8, message = "New password must be at least 8 characters long", groups = PasswordUpdate.class)
    private String newPassword;

    // Validation group for password update
    public interface PasswordUpdate {}

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
