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
        return new TokenDto(
                token.getId(),
                token.getUser().getId(),
                token.getServiceType().getId(),
                token.getTokenNumber(),
                token.getStatus(),
                token.getCreatedAt()
        );
    }

    @Override
    public java.util.Optional<TokenDto> getTokenById(Long tokenId) {
        return tokenRepository.findById(tokenId).map(this::toDto);
    }
}
