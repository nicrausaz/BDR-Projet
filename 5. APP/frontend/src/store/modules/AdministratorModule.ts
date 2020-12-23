import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import API from "@/plugins/API";
import Administrator from "@/models/Administrator";
import Credentials from "@/models/Credentials";
import router from "@/router";

interface AuthenticationToken {
  token: string;
}

@Module({namespaced: true})
export default class AdministratorModule extends VuexModule {
  administrator: Administrator | null = null;

  @Mutation
  public setAdministrator(administrator: Administrator) {
    this.administrator = administrator;
  }

  @Mutation
  public setAvatar(url: string) {
    if (!this.administrator?.avatar) return;
    this.administrator.avatar = url;
  }

  @Action
  public login({email, password}: Credentials): Promise<true | Error> {
    return API.axios
      .post<AuthenticationToken>("/auth/login", {
        email,
        password
      })
      .then(async ({data}) => {
        if (!data.token) return false;
        API.setToken(data.token);
        return await this.context.dispatch("getProfile");
      })
      .catch((e) => e);
  }

  @Action
  public async logout() {
    if (!this.administrator) return;
    API.clearToken();
    this.context.commit("setAdministrator", null);
    await router.push({name: "Login"});
  }

  @Action
  public async getProfile(): Promise<boolean> {
    if (localStorage.getItem("token")) {
      try {
        const {data} = await API.axios.get<Administrator>("/auth/getProfile");
        this.context.commit("setAdministrator", data);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
}
