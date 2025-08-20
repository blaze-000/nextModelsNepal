import axios from 'axios';

export const http = axios.create({
  timeout: 10000,
  validateStatus: () => true,
});
