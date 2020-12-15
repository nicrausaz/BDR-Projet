import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators'
import API from '@/plugins/api'

@Module({ namespaced: true })
export default class Administrator extends VuexModule {

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
  async login() {
    const response = await API.axios.post('/auth/login', {
      username: '',
      password: ''
    });
  }

  // @MutationAction({ mutate: ['events', 'conferences'] })
  // async fetchAll () {
  //   const response: Response = await API.axios.get('/player')
  //   return response.body
  // }
};
