import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Teams from "@/views/Teams.vue";
import Team from "@/views/Team.vue";
import Club from "@/views/Club.vue";
import Error from "@/views/Error.vue";
import PlayerProfile from "@/views/PlayerProfile.vue";
import GameResult from "@/views/GameResult.vue";
import GameList from "@/views/GameList.vue";
import Register from "@/views/Register.vue";
import About from "@/views/About.vue";
import UserProfile from "@/views/UserProfile.vue";
import Clubs from "@/views/Clubs.vue";
import Players from "@/views/Players.vue";
import Logs from "@/views/Logs.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/account",
    name: "Account",
    component: UserProfile,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/teams",
    name: "Teams",
    component: Teams,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/clubs",
    name: "Clubs",
    component: Clubs,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/players",
    name: "Players",
    component: Players,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/team/:id",
    name: "Team",
    component: Team,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/logs",
    name: "Logs",
    component: Logs,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/player/:id",
    name: "Player",
    component: PlayerProfile,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/club/:id",
    name: "Club",
    component: Club,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/game",
    name: "Game",
    component: GameList,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/game/:id",
    name: "GameResult",
    component: GameResult,
    meta: {
      authenticate: true
    }
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
  await store.dispatch("router/startLoad");
  if (!(await store.dispatch("administrator/getProfile")) && to.meta?.authenticate) {
    await store.dispatch("administrator/logout");
    if (to.name !== "Login")
      return next({
        name: "Login",
        query: {
          to: to.fullPath
        }
      });
  }
  next();
});
router.afterEach(async () => {
  await store.dispatch("router/endLoad");
});
export default router;
