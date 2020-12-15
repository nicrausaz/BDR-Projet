import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators'
import API from '@/plugins/api'

@Module({ namespaced: true })
export default class Player extends VuexModule {
  players: any[] = [];

  @Mutation
  public setPlayers (players: any[]) {
    this.players = players
  }

  @Action()
  public async fetchAll () {
    const response: Response = await API.axios.get('/player')
    this.context.commit('setPlayers', response.body)
    this.context.commit('setPlayers', [{ test: 'test' }])
  }

  // @MutationAction({ mutate: ['events', 'conferences'] })
  // async fetchAll () {
  //   const response: Response = await API.axios.get('/player')
  //   return response.body
  // }
};
