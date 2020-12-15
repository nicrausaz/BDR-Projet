import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import API from "@/plugins/api";
import Administrator from "@/models/Administrator";

interface AuthenticationToken {
  token: string;
}

@Module({namespaced: true})
export default class AdministratorModule extends VuexModule {
  administrator?: Administrator;

  @Mutation
  public setAdministrator(administrator: Administrator) {
    this.administrator = administrator;
    console.log("set", administrator);
  }

  @Action
  public async login({email, password}: {email: string; password: string}) {
    const {data} = await API.axios.post<AuthenticationToken>("/auth/login", {
      email,
      password
    });
    if (!data.token) return false;
    API.setToken(data.token);
    return await this.getProfile();
  }

  @Action
  public async getProfile() {
    if (localStorage.getItem("token")) {
      const {data} = await API.axios.get<Administrator>("/auth/getProfile");
      this.context.commit("setAdministrator", data);
      this.administrator = data;
      return true;
    }
    return false;
  }
}
