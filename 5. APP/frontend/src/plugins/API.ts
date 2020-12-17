import axios, {AxiosInstance} from "axios";

class API {
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: "http://localhost:8083/api",
      timeout: 1000
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
}

export default new API();
