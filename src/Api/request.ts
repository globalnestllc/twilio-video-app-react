import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  // 'Access-Control-Allow-Origin': '*'
};

const request = params => {
  return axios({
    headers: Object.assign({}, headers, { Authorization: params.token }),
    method: params.method,
    params: params.queryParams,
    url: params.url,
    data: params.data,
  });
};

export const get = params => request(Object.assign({ method: 'GET', ...params }));
export const post = params => request(Object.assign({ method: 'POST', ...params }));
export const put = params => request(Object.assign({ method: 'PUT', ...params }));
export const del = params => request(Object.assign({ method: 'DELETE', ...params }));
export const patch = params => request(Object.assign({ method: 'PATCH', ...params }));
