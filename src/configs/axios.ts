
import axios from 'axios';

const baseURL = ""
const axiosServices = axios.create({ baseURL, timeout: 5000 });

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;
