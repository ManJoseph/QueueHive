package queuehive.queuehive.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import queuehive.queuehive.dto.TokenUpdateEvent;

@Component
public class TokenEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public TokenEventPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishTokenUpdate(TokenUpdateEvent event) {
        messagingTemplate.convertAndSend("/topic/queue-updates", event);
    }
}
