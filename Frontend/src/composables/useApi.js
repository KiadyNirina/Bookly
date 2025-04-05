import apiClient from '@/plugins/axios';

export function useApi() {
  const request = async (method, url, data = null, config = {}) => {
    return apiClient({ method, url, data, ...config }).then(res => res.data);
  };

  return { request };
}