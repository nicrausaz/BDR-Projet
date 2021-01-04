import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

class API {
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://192.168.2.3:8083/api"
    });
    this.axios.interceptors.response.use((response) => {
      const isoDatePattern = new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/);
      return {
        ...response,
        data: JSON.parse(JSON.stringify(response.data), (key: string, value: unknown) =>
          typeof value === "string" && value.match(isoDatePattern) ? new Date(value) : value
        )
      };
    });
    this.setToken(localStorage.getItem("token") ?? "");
  }

  public setToken(token: string) {
    localStorage.setItem("token", token);
    this.axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  public clearToken() {
    localStorage.removeItem("token");
    this.axios.defaults.headers.common.Authorization = ``;
  }

  public async get<M>(Class: any, url: string, config?: AxiosRequestConfig) {
    const {data} = await this.axios.get(url, config);
    return (Array.isArray(data) ? data.map((d) => new Class(d)) : new Class(data)) as M;
  }

  public async delete<M>(Class: any, url: string, config?: AxiosRequestConfig) {
    const {data} = await this.axios.delete(url, config);
    return (Array.isArray(data) ? data.map((d) => new Class(d)) : new Class(data)) as M;
  }

  public async head<M>(Class: any, url: string, config?: AxiosRequestConfig) {
    const {data} = await this.axios.head(url, config);
    return (Array.isArray(data) ? data.map((d) => new Class(d)) : new Class(data)) as M;
  }

  public async options<M>(Class: any, url: string, config?: AxiosRequestConfig) {
    const {data} = await this.axios.options(url, config);
    return (Array.isArray(data) ? data.map((d) => new Class(d)) : new Class(data)) as M;
  }

  public async post<M>(Class: any, url: string, config?: AxiosRequestConfig) {
    const {data} = await this.axios.post(url, config);
    return (Array.isArray(data) ? data.map((d) => new Class(d)) : new Class(data)) as M;
  }

  public async put<M>(Class: any, url: string, config?: AxiosRequestConfig) {
    const {data} = await this.axios.put(url, config);
    return (Array.isArray(data) ? data.map((d) => new Class(d)) : new Class(data)) as M;
  }

  public async patch<M>(Class: any, url: string, config?: AxiosRequestConfig) {
    const {data} = await this.axios.patch(url, config);
    return (Array.isArray(data) ? data.map((d) => new Class(d)) : new Class(data)) as M;
  }
}

export default new API();
