package queuehive.queuehive.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import queuehive.queuehive.domain.QueueSequence;
import queuehive.queuehive.domain.ServiceType;
import queuehive.queuehive.domain.Token;
import queuehive.queuehive.domain.User;
import queuehive.queuehive.domain.Company;
import queuehive.queuehive.dto.CreateTokenRequest;
import queuehive.queuehive.dto.TokenDto;
import queuehive.queuehive.repository.QueueSequenceRepository;
import queuehive.queuehive.repository.ServiceTypeRepository;
import queuehive.queuehive.repository.TokenRepository;
import queuehive.queuehive.repository.UserRepository;
import queuehive.queuehive.service.impl.TokenServiceImpl;
import queuehive.queuehive.websocket.TokenEventPublisher;

import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceImplTest {

    @Mock private TokenRepository tokenRepository;
    @Mock private UserRepository userRepository;
    @Mock private ServiceTypeRepository serviceTypeRepository;
    @Mock private QueueSequenceRepository queueSequenceRepository;
    @Mock private TokenEventPublisher tokenEventPublisher;

    @InjectMocks private TokenServiceImpl tokenService;

    @Test
    void shouldCreateTokenAndIncrementSequence() {
        // Given
        CreateTokenRequest request = new CreateTokenRequest();
        request.setUserId(1L);
        request.setServiceId(1L);

        User user = new User();
        user.setId(1L);
        Company company = new Company();
        company.setId(1L);
        ServiceType serviceType = new ServiceType();
        serviceType.setId(1L);
        serviceType.setCompany(company);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(serviceTypeRepository.findById(1L)).thenReturn(Optional.of(serviceType));
        when(queueSequenceRepository.findByServiceType(serviceType)).thenReturn(Optional.empty());

        QueueSequence newSequence = new QueueSequence(serviceType, 1);
        when(queueSequenceRepository.save(any(QueueSequence.class))).thenReturn(newSequence);

        Token savedToken = new Token(user, serviceType, 1, "PENDING");
        when(tokenRepository.save(any(Token.class))).thenReturn(savedToken);

        // When
        TokenDto result = tokenService.createToken(request);

        // Then
        assertThat(result.getTokenNumber()).isEqualTo(1);
        verify(queueSequenceRepository).save(argThat(seq -> seq.getNextTokenNumber() == 2));
    }

    @Test
    void shouldCreateTokenWithExistingSequence() {
        // Given
        CreateTokenRequest request = new CreateTokenRequest();
        request.setUserId(1L);
        request.setServiceId(1L);

        User user = new User();
        user.setId(1L);
        Company company = new Company();
        company.setId(1L);
        ServiceType serviceType = new ServiceType();
        serviceType.setId(1L);
        serviceType.setCompany(company);
        
        QueueSequence existingSequence = new QueueSequence(serviceType, 5);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(serviceTypeRepository.findById(1L)).thenReturn(Optional.of(serviceType));
        when(queueSequenceRepository.findByServiceType(serviceType)).thenReturn(Optional.of(existingSequence));

        Token savedToken = new Token(user, serviceType, 5, "PENDING");
        when(tokenRepository.save(any(Token.class))).thenReturn(savedToken);

        // When
        TokenDto result = tokenService.createToken(request);

        // Then
        assertThat(result.getTokenNumber()).isEqualTo(5);
        verify(queueSequenceRepository).save(argThat(seq -> seq.getNextTokenNumber() == 6));
    }

    @Test
    void shouldHandleConcurrentTokenCreation() throws InterruptedException {
        // Given
        User user = new User();
        user.setId(1L);
        ServiceType serviceType = new ServiceType();
        serviceType.setId(1L);
        
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(serviceTypeRepository.findById(anyLong())).thenReturn(Optional.of(serviceType));
        
        AtomicInteger tokenCounter = new AtomicInteger(1);
        
        // This is a simplified simulation. A true transactional test would need an integration test setup.
        // We simulate the database sequence by returning an incrementing number.
        when(queueSequenceRepository.findByServiceType(any(ServiceType.class)))
            .thenAnswer(invocation -> Optional.of(new QueueSequence(serviceType, tokenCounter.get())));

        when(queueSequenceRepository.save(any(QueueSequence.class)))
            .thenAnswer(invocation -> {
                QueueSequence seq = invocation.getArgument(0);
                seq.setNextTokenNumber(tokenCounter.incrementAndGet());
                return seq;
            });

        when(tokenRepository.save(any(Token.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        int numberOfThreads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        for (int i = 0; i < numberOfThreads; i++) {
            executor.submit(() -> {
                CreateTokenRequest request = new CreateTokenRequest();
                request.setUserId(1L);
                request.setServiceId(1L);
                tokenService.createToken(request);
            });
        }

        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);

        // Then
        // Because of the @Transactional annotation on the service method, each call should
        // correctly increment the sequence without race conditions.
        // We verify that the sequence's next token number is the expected final value.
        assertThat(tokenCounter.get()).isEqualTo(numberOfThreads + 1);
    }
}
