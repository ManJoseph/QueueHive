package queuehive.queuehive.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import queuehive.queuehive.dto.CreateTokenRequest;
import queuehive.queuehive.dto.QueuePositionDto;
import queuehive.queuehive.dto.TokenDto;
import queuehive.queuehive.service.TokenService;

import java.util.List;

@RestController
@RequestMapping("/api/tokens")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping
    public ResponseEntity<TokenDto> createToken(@Valid @RequestBody CreateTokenRequest request) {
        TokenDto newToken = tokenService.createToken(request);
        return ResponseEntity.ok(newToken);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TokenDto> getTokenStatus(@PathVariable Long id) {
        return tokenService.getTokenById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/position")
    public ResponseEntity<QueuePositionDto> getQueuePosition(@PathVariable Long id) {
        // This endpoint requires the token to exist, otherwise the service will throw an exception
        QueuePositionDto position = tokenService.getQueuePosition(id);
        return ResponseEntity.ok(position);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TokenDto>> getActiveTokensByUserId(@PathVariable Long userId) {
        List<TokenDto> tokens = tokenService.getActiveTokensByUserId(userId);
        return ResponseEntity.ok(tokens);
    }

    @GetMapping("/service/{serviceId}/active")
    public ResponseEntity<List<TokenDto>> getActiveTokensByServiceId(@PathVariable Long serviceId) {
        List<TokenDto> tokens = tokenService.getActiveTokensByServiceId(serviceId);
        return ResponseEntity.ok(tokens);
    }

    @PutMapping("/{tokenId}/status")
    public ResponseEntity<TokenDto> updateTokenStatus(@PathVariable Long tokenId, @RequestParam String status) {
        TokenDto updatedToken = tokenService.updateTokenStatus(tokenId, status);
        return ResponseEntity.ok(updatedToken);
    }

    @PostMapping("/service/{serviceId}/call-next")
    public ResponseEntity<TokenDto> callNextToken(@PathVariable Long serviceId) {
        TokenDto calledToken = tokenService.callNextToken(serviceId);
        return ResponseEntity.ok(calledToken);
    }

    @PutMapping("/{tokenId}/mark-served")
    public ResponseEntity<TokenDto> markTokenServed(@PathVariable Long tokenId) {
        TokenDto servedToken = tokenService.markTokenServed(tokenId);
        return ResponseEntity.ok(servedToken);
    }

    @PutMapping("/{tokenId}/skip")
    public ResponseEntity<TokenDto> skipToken(@PathVariable Long tokenId) {
        TokenDto skippedToken = tokenService.skipToken(tokenId);
        return ResponseEntity.ok(skippedToken);
    }

    @PutMapping("/{tokenId}/cancel")
    public ResponseEntity<TokenDto> cancelToken(@PathVariable Long tokenId) {
        TokenDto cancelledToken = tokenService.cancelToken(tokenId);
        return ResponseEntity.ok(cancelledToken);
    }
}
