import { Action, Module, VuexModule } from "vuex-module-decorators";
import API from "@/plugins/api";

interface AuthenticationToken {
  token: string;
}

@Module({ namespaced: true })
export default class AdministratorModule extends VuexModule {
  // @Mutation
  // public setPlayers (players: any[]) {
  //   console.log(players)
  //   this.players = players
  // }
  //
  // @Action
  // public async fetchAll () {
  //   const response = await API.axios.get('/player')
  //   this.context.commit('setPlayers', response.data)
  // }

  @Action
  async login(username: string, password: string) {
    const { data } = await API.axios.post<AuthenticationToken>("/auth/login", {
      username,
      password,
    });
    if (!data.token) return false;
    API.setToken(data.token);
  }

  // @MutationAction({ mutate: ['events', 'conferences'] })
  // async fetchAll () {
  //   const response: Response = await API.axios.get('/player')
  //   return response.body
  // }
}
