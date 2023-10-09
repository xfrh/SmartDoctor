import { fetchUtils, DataProvider  } from 'react-admin';
import { stringify } from 'query-string';
import {getCurrentDateTime } from './users'

// 定义后端API的基本URL
const apiUrl = 'http://192.168.1.108:8000';

const httpClient = (url, options = {}) => {
  // 添加 access_token 到请求头
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    options.headers = new Headers({
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    });
  }

  return fetchUtils.fetchJson(url, options);
};

// 定义数据提供者
const dataProvider: DataProvider = {
   getList: (resource, params) => {
   const url = `${apiUrl}/${resource}`;
   return httpClient(url).then((response) => ({
           data: response.json.map((item: string) => {
           const parsedItem = JSON.parse(item);
           return parsedItem;
         }),
         total:1,
    }));

  },

  getOne: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
      return httpClient(url).then((response) => ({
        data: JSON.parse(response.json),
    }));

  },

  getMany: (resource, params) => {
    const url = `${apiUrl}/${resource}/`;
     return httpClient(url).then((response) => ({
      data: response.json,
    }));
  },
  getManyReference:(resource, params) => {
    const url = `${apiUrl}/${resource}/`;
    return httpClient(url).then((response) => ({
      data: response.json,
    }));
  },
  
  getImage: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return httpClient(url)
    .then(response => response.text()) // 以字符串形式读取响应数据
    .then(data => ({
      data: data, 
    }));
    

  },


  create: (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    const cur_time=getCurrentDateTime();
    params.data.createAt=cur_time;
    return httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      })
      .then((response) => ({
        data: response.json,
      }));
  },

  update: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
   
    return httpClient(url, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      })
      .then((response) => ({
        data: response.json,
      }));
  },

  updateMany:(resource, params) => {
    const url = `${apiUrl}/${resource}/`;
    return httpClient(url, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      })
      .then((response) => ({
        data: response.json,
      }));
  },
  delete: (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
   
    return httpClient(url, {
        method: 'Delete',
      })
      .then((response) => ({
        data: response.json,
      }));
  },

  deleteMany: (resource, params) => {
    const url = `${apiUrl}/${resource}/${stringify(params)}`;
    console.log(url);
    return httpClient(url, {
        method: 'Delete',
      })
      .then((response) => ({
        data: response.json,
      }));
  },



 
};

 export default dataProvider;
