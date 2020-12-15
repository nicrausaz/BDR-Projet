import Vue from "vue";
import Vuex from "vuex";
import player from "@/store/modules/PlayerModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    player
  }
});
