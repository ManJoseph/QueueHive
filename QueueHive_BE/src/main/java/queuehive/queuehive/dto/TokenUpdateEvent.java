package queuehive.queuehive.dto;

public class TokenUpdateEvent {
    private int tokenNumber;
    private long serviceId;

    public TokenUpdateEvent(int tokenNumber, long serviceId) {
        this.tokenNumber = tokenNumber;
        this.serviceId = serviceId;
    }

    // Getters and Setters
    public int getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(int tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public long getServiceId() {
        return serviceId;
    }

    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }
}
