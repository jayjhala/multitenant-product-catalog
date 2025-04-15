// lib/product-api.ts
import axios from 'axios';

const productApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PRODUCT_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default productApi;
