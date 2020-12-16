import Vue from "vue";
import Vuex from "vuex";
import player from "@/store/modules/PlayerModule";
import administrator from "@/store/modules/AdministratorModule";
import team from "@/store/modules/TeamModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    player,
    administrator,
    team
  }
});
