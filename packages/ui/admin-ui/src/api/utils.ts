import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export const createClient = (config: AxiosRequestConfig = {}): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.REACT_APP_API_ROOT,
    timeout: 14000,
    ...config,
  });

  return client;
};

export const request = (): AxiosInstance => {
  if (!process.env.REACT_APP_API_ROOT) {
    throw new Error('No API url');
  }

  return createClient();
};