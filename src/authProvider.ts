import { AuthProvider} from "react-admin";

export const authProvider: AuthProvider = {
    // called when the user attempts to log in
    login: ({ username, password }) => {
        const apiUrl = 'http://192.168.1.108:8000/login'; 
     
        return fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('登录失败'); 
            }
            return response.json();
          })
          .then((data) => {
           
            if (data.access_token) {
              localStorage.setItem('access_token', data.access_token);
               return Promise.resolve();
             } else {
              throw new Error('登录失败，无法获取令牌'); // 可根据实际情况自定义错误消息
            }
          });
      },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem("access_token");
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }: { status: number }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("access_token");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem("access_token")
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};

