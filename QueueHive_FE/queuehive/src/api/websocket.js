import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Stomp = require('@stomp/stompjs');

const createStompClient = () => {
  const client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  return client;
};

const subscribeToTopic = (client, topic, callback) => {
  client.subscribe(topic, (message) => {
    callback(JSON.parse(message.body));
  });
};

export { createStompClient, subscribeToTopic };
