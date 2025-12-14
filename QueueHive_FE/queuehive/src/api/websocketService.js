import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const WEBSOCKET_URL = 'http://localhost:8080/ws';

const websocketService = {
  connect: (onConnect) => {
    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {};
    stompClient.connect({}, onConnect);
    return stompClient;
  },

  subscribeToTopic: (client, topic, callback) => {
    if (client && client.connected) {
      return client.subscribe(topic, (message) => {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      });
    }
    return null;
  },

  disconnect: (client) => {
    if (client && client.connected) {
      client.disconnect();
    }
  }
};

export default websocketService;
