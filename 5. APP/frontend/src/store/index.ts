import Vue from "vue";
import Vuex from "vuex";
import administrator from "@/store/modules/AdministratorModule";
import router from "@/store/modules/RouterModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    administrator,
    router
  }
});
