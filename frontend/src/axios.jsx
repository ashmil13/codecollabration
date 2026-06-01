import axios from 'axios';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const BASE_URL = apiUrl;

export default axios.create({
  baseURL: BASE_URL
});




export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});
