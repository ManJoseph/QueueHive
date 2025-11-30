package queuehive.queuehive.service;

import queuehive.queuehive.dto.CreateTokenRequest;
import queuehive.queuehive.dto.QueuePositionDto;
import queuehive.queuehive.dto.TokenDto;

public interface TokenService {
    TokenDto createToken(CreateTokenRequest request);
    QueuePositionDto getQueuePosition(Long tokenId);
    Optional<TokenDto> getTokenById(Long tokenId);
}
