import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL for your Spring Boot backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default http;
