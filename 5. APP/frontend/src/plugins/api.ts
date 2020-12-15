import axios, {AxiosInstance} from "axios";

class API {
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://localhost:8083/api",
      timeout: 1000
    });
  }

  public setToken(token: string) {
    this.axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export default new API();
