import React, { useState } from 'react';
import Home from './pages/Home';
import BookToken from './pages/BookToken';
import './theme.css'; // Import the global theme styles

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'bookToken'
  const [tokenData, setTokenData] = useState(null); // Data for BookToken page

  const goToBookToken = (data) => {
    setTokenData(data);
    setCurrentPage('bookToken');
  };

  const goToHome = () => {
    setTokenData(null);
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && <Home goToBookToken={goToBookToken} />}
      {currentPage === 'bookToken' && <BookToken tokenData={tokenData} goToHome={goToHome} />}
    </>
  );
}

export default App;

