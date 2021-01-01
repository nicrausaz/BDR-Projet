import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";

@Module({namespaced: true})
export default class RouterModule extends VuexModule {
  routeIsLoading = false;

  @Mutation
  public setLoading(value: boolean) {
    this.routeIsLoading = value;
  }

  @Action
  public startLoad() {
    this.context.commit("setLoading", true);
  }

  @Action
  public endLoad() {
    this.context.commit("setLoading", false);
  }
}
