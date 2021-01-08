import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import Login from "@/views/auth/Login.vue";
import Teams from "@/views/team/Teams.vue";
import TeamIndex from "@/views/team/TeamIndex.vue";
import ClubIndex from "@/views/club/ClubIndex.vue";
import Error from "@/views/Error.vue";
import PlayerIndex from "@/views/player/PlayerIndex.vue";
import GameIndex from "@/views/game/GameIndex.vue";
import Games from "@/views/game/Games.vue";
import Register from "@/views/auth/Register.vue";
import About from "@/views/About.vue";
import UserProfile from "@/views/auth/UserProfile.vue";
import Clubs from "@/views/club/Clubs.vue";
import Players from "@/views/player/Players.vue";
import Logs from "@/views/Logs.vue";
import Calendar from "@/views/Calendar.vue";

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
    component: TeamIndex,
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
    component: PlayerIndex,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/club/:id",
    name: "Club",
    component: ClubIndex,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/game",
    name: "Game",
    component: Games,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/game/:id",
    name: "GameResult",
    component: GameIndex,
    meta: {
      authenticate: true
    }
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar,
    meta: {
      authenticate: true
    }
  },
  {
    path: "*",
    name: "Error",
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
