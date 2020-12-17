import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import Login from "@/components/Login.vue";
import Teams from "@/views/Teams.vue";
import Team from "@/views/Team.vue";

import Error from "@/views/Error.vue";
import PlayerProfile from "@/views/PlayerProfile.vue";
import GameResult from "@/views/GameResult.vue";
import GameList from "@/views/GameList.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },

  {
    path: "/login",
    name: "Login",
    component: Login
  },

  {
    path: "/teams",
    name: "Teams",
    component: Teams
  },

  {
    path: "/team/:id",
    name: "Team",
    component: Team
  },

  {
    path: "/player/:id",
    name: "Player",
    component: PlayerProfile
  },
  {
    path: "/game",
    name: "Game",
    component: GameList
  },
  {
    path: "/game/:id",
    name: "GameResult",
    component: GameResult
  },

  {
    path: "*",
    name: "err",
    component: Error
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  return next();
  if (!(await store.dispatch("administrator/getProfile"))) {
    await store.dispatch("administrator/logout");
    if (to.name !== "Login") return next({name: "Login"});
  }
  next();
});
export default router;
