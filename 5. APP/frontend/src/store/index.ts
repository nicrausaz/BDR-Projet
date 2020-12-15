import Vue from "vue";
import Vuex from "vuex";
import player from "@/store/modules/PlayerModule";
import administrator from "@/store/modules/AdministratorModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    player,
    administrator
  }
});
