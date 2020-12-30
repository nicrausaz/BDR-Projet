import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import API from "@/plugins/API";
import Team from "@/models/Team";
import Pagination from "@/models/Pagination";

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
    const data = await API.get<Pagination<Team>>(Pagination, "/player/" + uid + "/teams");
    this.context.commit("setTeams", data.result);
  }
}
