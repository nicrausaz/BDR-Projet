import axios, {AxiosInstance} from "axios";

class API {
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://localhost:8083/api",
      timeout: 1000
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
}

export default new API();
