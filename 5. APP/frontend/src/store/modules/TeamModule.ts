import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import API from "@/plugins/api";
import Team from "@/models/Team";

@Module({namespaced: true})
export default class PlayerModule extends VuexModule {
  teams: Team[] = [];

  team: Team | null = null;

  @Mutation
  public setTeams(teams: Team[]) {
    this.teams = teams;
  }

  @Action
  public async fetchTeams(uid: string) {
    const {data} = await API.axios.get<Team[]>("/player/" + uid + "/teams");
    this.context.commit("setTeams", data);
  }
}
