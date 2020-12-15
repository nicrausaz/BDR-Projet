import Vue from 'vue'
import Vuex from 'vuex'

import Player from '@/store/modules/Player'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Player
  }
})
