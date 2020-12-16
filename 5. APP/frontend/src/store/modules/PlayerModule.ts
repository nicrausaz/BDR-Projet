import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import API from "@/plugins/API";
import Player from "@/models/Player";

@Module({namespaced: true})
export default class PlayerModule extends VuexModule {
  players: Player[] = [];

  @Mutation
  public setPlayers(players: Player[]) {
    this.players = players;
  }

  @Action
  public async fetchAll() {
    const response = await API.axios.get<Player[]>("/player");
    this.context.commit("setPlayers", response.data);
  }

  // @MutationAction({ mutate: ['events', 'conferences'] })
  // async fetchAll () {
  //   const response: Response = await API.axios.get('/player')
  //   return response.body
  // }
}
