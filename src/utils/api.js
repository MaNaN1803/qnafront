import axios from 'axios';

// let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let API_URL = import.meta.env.VITE_API_URL || 'https://qna-4cfa.onrender.com/api';

export const apiRequest = async (url, method = 'GET', body = null, token = '', config = {}) => {
  try {
    const headers = {
      'Content-Type': body instanceof FormData ? 'multipart/form-data' : 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };

    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data: body,
      headers,
      ...config
    });

    return response.data;
  } catch (error) {
    console.error('API Request Error:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || error.message;
    const errorCode = error.response?.status || 500;
    throw new Error(`API Error ${errorCode}: ${errorMessage}`);
  }
};

export const setApiBaseUrl = (url) => {
  if (url) API_URL = url;
};