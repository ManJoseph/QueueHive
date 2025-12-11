package queuehive.queuehive.dto;

import java.util.Map;

public class DashboardOverviewDto {
    private long totalCompanies;
    private long approvedCompanies;
    private long pendingCompanies;
    private long totalUsers;
    private long totalTokensToday;
    private long activeQueues;
    private Map<String, Long> dailyTraffic;
    private Map<String, Long> weeklyTraffic;
    private Map<String, Long> monthlyTraffic;
    private String systemHealth;

    public DashboardOverviewDto(long totalCompanies, long approvedCompanies, long pendingCompanies, long totalUsers, long totalTokensToday, long activeQueues, Map<String, Long> dailyTraffic, Map<String, Long> weeklyTraffic, Map<String, Long> monthlyTraffic, String systemHealth) {
        this.totalCompanies = totalCompanies;
        this.approvedCompanies = approvedCompanies;
        this.pendingCompanies = pendingCompanies;
        this.totalUsers = totalUsers;
        this.totalTokensToday = totalTokensToday;
        this.activeQueues = activeQueues;
        this.dailyTraffic = dailyTraffic;
        this.weeklyTraffic = weeklyTraffic;
        this.monthlyTraffic = monthlyTraffic;
        this.systemHealth = systemHealth;
    }

    // Getters and Setters
    public long getTotalCompanies() {
        return totalCompanies;
    }

    public void setTotalCompanies(long totalCompanies) {
        this.totalCompanies = totalCompanies;
    }

    public long getApprovedCompanies() {
        return approvedCompanies;
    }

    public void setApprovedCompanies(long approvedCompanies) {
        this.approvedCompanies = approvedCompanies;
    }

    public long getPendingCompanies() {
        return pendingCompanies;
    }

    public void setPendingCompanies(long pendingCompanies) {
        this.pendingCompanies = pendingCompanies;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalTokensToday() {
        return totalTokensToday;
    }

    public void setTotalTokensToday(long totalTokensToday) {
        this.totalTokensToday = totalTokensToday;
    }

    public long getActiveQueues() {
        return activeQueues;
    }

    public void setActiveQueues(long activeQueues) {
        this.activeQueues = activeQueues;
    }

    public Map<String, Long> getDailyTraffic() {
        return dailyTraffic;
    }

    public void setDailyTraffic(Map<String, Long> dailyTraffic) {
        this.dailyTraffic = dailyTraffic;
    }

    public Map<String, Long> getWeeklyTraffic() {
        return weeklyTraffic;
    }

    public void setWeeklyTraffic(Map<String, Long> weeklyTraffic) {
        this.weeklyTraffic = weeklyTraffic;
    }

    public Map<String, Long> getMonthlyTraffic() {
        return monthlyTraffic;
    }

    public void setMonthlyTraffic(Map<String, Long> monthlyTraffic) {
        this.monthlyTraffic = monthlyTraffic;
    }

    public String getSystemHealth() {
        return systemHealth;
    }

    public void setSystemHealth(String systemHealth) {
        this.systemHealth = systemHealth;
    }
}
