import axios from 'axios';

// Create an Axios instance
const http = axios.create({
  baseURL: 'http://localhost:8080/api', // Adjust if your backend URL is different
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or wherever you store your token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // This is where we handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status } = error.response;
      let errorMessage = 'An unexpected error occurred.';
      let errorDetails = [];

      if (data) {
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error) { // Common Spring Boot error structure
          errorMessage = data.error;
        }

        // Handle Spring Boot validation errors (MethodArgumentNotValidException)
        if (data.errors && Array.isArray(data.errors)) {
          errorDetails = data.errors.map(err => ({
            field: err.field,
            message: err.defaultMessage
          }));
          // Optionally, concatenate validation messages to the main message
          if (errorDetails.length > 0) {
              errorMessage += ": " + errorDetails.map(d => `${d.field} - ${d.message}`).join(', ');
          }
        }
      }

      // Log error for debugging (can be replaced with a global notification service)
      console.error('API Error:', {
        statusCode: status,
        message: errorMessage,
        details: errorDetails,
        originalError: error.response
      });

      // Re-throw the error with a standardized format
      return Promise.reject({
        statusCode: status,
        message: errorMessage,
        details: errorDetails,
        original: error // Keep original error for full context if needed
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', error.request);
      return Promise.reject({
        statusCode: 0, // Indicate no status code from server
        message: 'No response from server. Please check your network connection.',
        details: [],
        original: error
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error: Request setup error', error.message);
      return Promise.reject({
        statusCode: -1, // Indicate a client-side request error
        message: 'Request failed to send. Please try again.',
        details: [],
        original: error
      });
    }
  }
);

export default http;

