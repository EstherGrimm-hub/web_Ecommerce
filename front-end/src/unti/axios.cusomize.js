import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API,

  // Alter defaults after instance has been created
 
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {

    if(response && response.data){
      return response.data;
    }
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default instance;