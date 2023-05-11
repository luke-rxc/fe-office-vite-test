import { TOKEN } from '@constants/auth';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface AxiosCreateModel {
  baseURL: string;
  headers?: Record<string, unknown>;
  withCredentials: boolean;
  config?: AxiosRequestConfig;
}

export interface ErrorInfoModel {
  field: string;
  reason: string;
  value: string;
}

export interface ErrorDataModel {
  message: string;
  timestamp: number;
  code: string;
  errors: Array<ErrorInfoModel>;
}

export interface ErrorModel<T = ErrorDataModel> {
  data: T | undefined;
  message: string;
  status: number | undefined;
}

function axiosResponseToData<T>(res: AxiosResponse<T>): T {
  return res.data;
}

function axiosErrorToData<T>({ response, message }: AxiosError<T>): ErrorModel<T> {
  return {
    data: response?.data,
    message,
    status: response?.status,
  };
}

function axiosErrorRedirects({ response }: AxiosError) {
  // if response status code is 302 redirect
  if (typeof response !== 'undefined' && response.status === 302) {
    const { location } = response.headers as Record<string, string>;

    if (typeof location === 'string') {
      window.location.replace(location);
    }
  }
}

type AxiosHeaders = Record<string, string | undefined> | undefined;

function injectToken(config: AxiosRequestConfig) {
  const token = localStorage.getItem(TOKEN) ?? '';

  Object.assign(config, {
    headers: {
      ...((config.headers as AxiosHeaders) ?? {}),
      Authorization: token,
    },
  });
}

export const createAxios = ({ baseURL, headers, withCredentials = false, config }: AxiosCreateModel) => {
  const request = axios.create({
    baseURL,
    headers: {
      common: headers,
    },
    withCredentials,
    ...config,
  });

  request.interceptors.request.use((_config) => {
    injectToken(_config);

    return _config;
  });

  request.interceptors.response.use(
    (_config) => _config,
    (error: AxiosError) => {
      if (error.response.status === 401) {
        window.location.replace('/logout');
      }
      return Promise.reject(error);
    },
  );

  return {
    async get<Response, Params = object, Error = void>(url: string, params?: Params) {
      try {
        const res = await request.get<Response>(url, { params });
        return axiosResponseToData(res);
      } catch (error) {
        axiosErrorRedirects(error);

        return Promise.reject(axiosErrorToData<Error>(error));
      }
    },
    async post<Response, Data = object, Error = void>(url: string, data?: Data) {
      try {
        const res = await request.post<Response>(url, data);
        return axiosResponseToData(res);
      } catch (error) {
        return Promise.reject(axiosErrorToData<Error>(error));
      }
    },
    async put<Response, Data = object, Error = void>(url: string, data?: Data) {
      try {
        const res = await request.put<Response>(url, data);
        return axiosResponseToData(res);
      } catch (error) {
        return Promise.reject(axiosErrorToData<Error>(error));
      }
    },
    async delete<Response, Data = object, Error = void>(url: string, data?: Data) {
      try {
        const res = await request.delete<Response>(url, { data });
        return axiosResponseToData(res);
      } catch (error) {
        return Promise.reject(axiosErrorToData<Error>(error));
      }
    },
  };
};
