import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators'
import API from '@/plugins/api'

@Module({ namespaced: true })
export default class Player extends VuexModule {
  players: any[] = [];

  @Mutation
  public setPlayers (players: any[]) {
    console.log(players)
    this.players = players
  }

  @Action
  public async fetchAll () {
    const response = await API.axios.get('/player')
    this.context.commit('setPlayers', response.data)
  }

  // @MutationAction({ mutate: ['events', 'conferences'] })
  // async fetchAll () {
  //   const response: Response = await API.axios.get('/player')
  //   return response.body
  // }
};
