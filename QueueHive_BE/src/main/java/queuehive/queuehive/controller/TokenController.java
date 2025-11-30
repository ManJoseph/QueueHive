package queuehive.queuehive.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import queuehive.queuehive.dto.CreateTokenRequest;
import queuehive.queuehive.dto.QueuePositionDto;
import queuehive.queuehive.dto.TokenDto;
import queuehive.queuehive.service.TokenService;

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
}
