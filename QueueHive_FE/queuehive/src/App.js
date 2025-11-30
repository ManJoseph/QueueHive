import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import BookToken from './pages/BookToken';
import { createStompClient, subscribeToTopic } from './api/websocket';
import './theme.css'; // Import the global theme styles

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'bookToken'
  const [tokenData, setTokenData] = useState(null); // Data for BookToken page
  const [stompClient, setStompClient] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const client = createStompClient();
    
    client.onConnect = () => {
      console.log('WebSocket Connected!');
      setStompClient(client);
      subscribeToTopic(client, '/topic/queue-updates', (message) => {
        console.log('Received message:', message);
        setLastMessage(message);
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };
    
    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
        console.log('WebSocket Disconnected');
      }
    };
  }, []);


  const goToBookToken = (data) => {
    setTokenData(data);
    setCurrentPage('bookToken');
  };

  const goToHome = () => {
    setTokenData(null);
    setCurrentPage('home');
    setLastMessage(null); // Clear message when returning home
  };

  return (
    <>
      {currentPage === 'home' && <Home goToBookToken={goToBookToken} />}
      {currentPage === 'bookToken' && (
        <BookToken 
          tokenData={tokenData} 
          goToHome={goToHome}
          lastMessage={lastMessage}
        />
      )}
    </>
  );
}

export default App;

