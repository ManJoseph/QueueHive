package queuehive.queuehive.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import queuehive.queuehive.domain.QueueSequence;
import queuehive.queuehive.domain.ServiceType;
import queuehive.queuehive.domain.Token;
import queuehive.queuehive.domain.User;
import queuehive.queuehive.dto.CreateTokenRequest;
import queuehive.queuehive.dto.QueuePositionDto;
import queuehive.queuehive.dto.TokenDto;
import queuehive.queuehive.repository.*;
import queuehive.queuehive.service.TokenService;
import queuehive.queuehive.websocket.TokenEventPublisher;
import queuehive.queuehive.dto.TokenUpdateEvent;

import java.util.List;


@Service
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final QueueSequenceRepository queueSequenceRepository;
    private final TokenEventPublisher tokenEventPublisher;

    public TokenServiceImpl(TokenRepository tokenRepository, UserRepository userRepository, ServiceTypeRepository serviceTypeRepository, QueueSequenceRepository queueSequenceRepository, TokenEventPublisher tokenEventPublisher) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.queueSequenceRepository = queueSequenceRepository;
        this.tokenEventPublisher = tokenEventPublisher;
    }

    @Override
    @Transactional
    public TokenDto createToken(CreateTokenRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ServiceType serviceType = serviceTypeRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        QueueSequence sequence = queueSequenceRepository.findByServiceType(serviceType)
                .orElseGet(() -> {
                    QueueSequence newSequence = new QueueSequence(serviceType, 1);
                    return queueSequenceRepository.save(newSequence);
                });

        int tokenNumber = sequence.getNextTokenNumber();
        sequence.setNextTokenNumber(tokenNumber + 1);
        queueSequenceRepository.save(sequence);

        Token token = new Token(user, serviceType, tokenNumber, "PENDING");
        Token savedToken = tokenRepository.save(token);
        
        tokenEventPublisher.publishTokenUpdate(new TokenUpdateEvent(savedToken.getTokenNumber(), savedToken.getServiceType().getId()));

        return toDto(savedToken);
    }

    @Override
    public QueuePositionDto getQueuePosition(Long tokenId) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found"));
        
        long position = tokenRepository.countByServiceTypeAndStatusInAndCreatedAtBefore(
                token.getServiceType(),
                List.of("PENDING", "CALLING"),
                token.getCreatedAt()
        );

        return new QueuePositionDto((int) position);
    }

    private TokenDto toDto(Token token) {
        ServiceType serviceType = token.getServiceType();
        queuehive.queuehive.dto.ServiceTypeDto serviceTypeDto = new queuehive.queuehive.dto.ServiceTypeDto(
                serviceType.getId(),
                serviceType.getCompany().getId(),
                serviceType.getCompany().getName(),
                serviceType.getName(),
                serviceType.getDescription(), // Include description
                serviceType.getAverageServiceTime()
        );

        return new TokenDto(
                token.getId(),
                token.getUser().getId(),
                token.getServiceType().getId(),
                token.getTokenNumber(),
                token.getStatus(),
                token.getCreatedAt(),
                serviceTypeDto
        );
    }

    @Override
    public java.util.Optional<TokenDto> getTokenById(Long tokenId) {
        return tokenRepository.findById(tokenId).map(this::toDto);
    }

    @Override
    public List<TokenDto> getActiveTokensByUserId(Long userId) {
        List<String> activeStatuses = List.of("PENDING", "CALLING");
        return tokenRepository.findByUserIdAndStatusIn(userId, activeStatuses)
                .stream()
                .map(this::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<TokenDto> getAllTokensByUserId(Long userId) {
        return tokenRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<TokenDto> getActiveTokensByServiceId(Long serviceId) {
        List<String> activeStatuses = List.of("PENDING", "CALLING"); // Tokens that are considered active in a queue
        return tokenRepository.findByServiceTypeIdAndStatusInOrderByCreatedAtAsc(serviceId, activeStatuses)
                .stream()
                .map(this::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional
    public TokenDto updateTokenStatus(Long tokenId, String status) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found with ID: " + tokenId));

        // Validate status if needed (e.g., must be one of "PENDING", "CALLING", "SERVED", "REJECTED")
        token.setStatus(status);
        Token updatedToken = tokenRepository.save(token);

        tokenEventPublisher.publishTokenUpdate(new TokenUpdateEvent(updatedToken.getTokenNumber(), updatedToken.getServiceType().getId()));

        return toDto(updatedToken);
    }

    @Override
    @Transactional
    public TokenDto callNextToken(Long serviceId) {
        Token nextPendingToken = tokenRepository.findFirstByServiceTypeIdAndStatusOrderByCreatedAtAsc(serviceId, "PENDING")
                .orElseThrow(() -> new RuntimeException("No pending tokens for service ID: " + serviceId));

        nextPendingToken.setStatus("CALLING");
        Token updatedToken = tokenRepository.save(nextPendingToken);
        tokenEventPublisher.publishTokenUpdate(new TokenUpdateEvent(updatedToken.getTokenNumber(), updatedToken.getServiceType().getId()));
        return toDto(updatedToken);
    }

    @Override
    @Transactional
    public TokenDto markTokenServed(Long tokenId) {
        return updateTokenStatus(tokenId, "SERVED");
    }

    @Override
    @Transactional
    public TokenDto skipToken(Long tokenId) {
        return updateTokenStatus(tokenId, "SKIPPED");
    }

    @Override
    @Transactional
    public TokenDto cancelToken(Long tokenId) {
        return updateTokenStatus(tokenId, "CANCELLED");
    }
}
