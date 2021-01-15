import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/About.vue")
  },
  {
    path: "/account",
    name: "Account",
    component: () => import("@/views/auth/UserProfile.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/Register.vue")
  },
  {
    path: "/teams",
    name: "Teams",
    component: () => import("@/views/team/Teams.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/clubs",
    name: "Clubs",
    component: () => import("@/views/club/Clubs.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/federation",
    name: "Federations",
    component: () => import("@/views/federation/Federations.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/league",
    name: "Leagues",
    component: () => import("@/views/league/Leagues.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/players",
    name: "Players",
    component: () => import("@/views/player/Players.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/team/:id",
    name: "TeamIndex",
    component: () => import("@/views/team/TeamIndex.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/logs",
    name: "Logs",
    component: () => import("@/views/Logs.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/player/:id",
    name: "PlayerIndex",
    component: () => import("@/views/player/PlayerIndex.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/club/:id",
    name: "ClubIndex",
    component: () => import("@/views/club/ClubIndex.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/federation/:id",
    name: "FederationIndex",
    component: () => import("@/views/federation/FederationIndex.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/league/:id",
    name: "LeagueIndex",
    component: () => import("@/views/league/LeagueIndex.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/game",
    name: "Game",
    component: () => import("@/views/game/Games.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/game/:id",
    name: "GameIndex",
    component: () => import("@/views/game/GameIndex.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/training/",
    name: "Training",
    component: () => import("@/views/training/Trainings.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/training/:id",
    name: "TrainingIndex",
    component: () => import("@/views/training/TrainingIndex.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: () => import("@/views/Calendar.vue"),
    meta: {
      authenticate: true
    }
  },
  {
    path: "/server-stats",
    name: "ServerStats",
    component: () => import("@/views/ServerStats.vue")
  },
  {
    path: "*",
    name: "Error",
    component: () => import("@/views/Error.vue")
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
