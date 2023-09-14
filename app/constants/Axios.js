import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Axios = axios.create({
  // baseURL: 'https://brofit.onrender.com/api/v1/', //main server
  //baseURL: 'http://192.168.1.4:7000/api/v1/', //uday server
  baseURL: 'http://192.168.1.8:3000/api/v1/', //vinist server
  timeout: 5000, // Adjust the timeout as needed
});

// Function to retrieve the token from SecureStore
async function getTokenFromSecureStore() {
  try {
    const token = await SecureStore.getItemAsync('token');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

// Register the request interceptor once during app initialization
Axios.interceptors.request.use(async (config) => {
  const token = await getTokenFromSecureStore();
  if (token) {
    config.headers['x-access-token'] = token;
    // console.log('Token set:', token);
  }
  return config;
});

export function setTokenHeader() {
  // Update the token in SecureStore here
  // Return a Promise
  return new Promise((resolve, reject) => {
    Axios.interceptors.request.eject(0);
    Axios.interceptors.request.use(async (config) => {
      const token = await getTokenFromSecureStore();
      if (token) {
        config.headers['x-access-token'] = token;
        // console.log('Token set:', token);
      }
      return config;
    });
    resolve();
  });
}

// Axios.interceptors.request.use((config) => {
//   console.log('Request Headers:', config.headers);
//   return config;
// });

export default Axios;
