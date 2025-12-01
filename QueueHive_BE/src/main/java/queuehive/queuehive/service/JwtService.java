package queuehive.queuehive.service;

import queuehive.queuehive.domain.User;

public interface JwtService {
    String generateToken(User user);
    // Potentially add methods for token validation, parsing, etc. if needed later
}
