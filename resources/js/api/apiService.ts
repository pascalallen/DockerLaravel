import _ from 'lodash';
import axios, { AxiosInstance } from 'axios';
import { ApiOptions } from '@/types/api';
import { RootState } from '@/types/redux';
import store from '@/redux/store';

const apiHeaders = {
  read: { Accept: 'application/json' },
  write: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
};

const create = async (options?: ApiOptions): Promise<AxiosInstance> => {
  const api = axios.create({
    baseURL: '/api/',
    headers: {
      get: apiHeaders.read,
      post: apiHeaders.write,
      put: apiHeaders.write,
      patch: apiHeaders.write,
      delete: apiHeaders.write
    }
  });

  if (options?.auth ?? false) {
    const state: RootState = store.getState();
    const currentToken = state.user.access_token;

    api.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${currentToken}`;
      return config;
    });
  }

  if (options?.headers ?? null) {
    api.interceptors.request.use(config => {
      _.forEach(options?.headers, (val, key) => {
        config.headers[key] = val;
      });
      return config;
    });
  }

  return api;
};

export default Object.freeze({
  create
});
