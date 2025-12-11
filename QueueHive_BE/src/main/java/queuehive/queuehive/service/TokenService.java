package queuehive.queuehive.service;

import queuehive.queuehive.dto.CreateTokenRequest;
import queuehive.queuehive.dto.QueuePositionDto;
import queuehive.queuehive.dto.TokenDto;

import java.util.List; // Import List
import java.util.Optional;

public interface TokenService {
    TokenDto createToken(CreateTokenRequest request);
    QueuePositionDto getQueuePosition(Long tokenId);
    Optional<TokenDto> getTokenById(Long tokenId);
    List<TokenDto> getActiveTokensByUserId(Long userId);
    
    // New methods for Company Admin
    List<TokenDto> getActiveTokensByServiceId(Long serviceId);
    TokenDto updateTokenStatus(Long tokenId, String status);
    TokenDto callNextToken(Long serviceId);
    TokenDto markTokenServed(Long tokenId);
    TokenDto skipToken(Long tokenId);
    TokenDto cancelToken(Long tokenId);
}
