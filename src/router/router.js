import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Registration from "../components/Registration.vue";
import HealthManagement from "../components/HealthManagement.vue";
import ActivityReports from "../components/ActivityReports.vue";
import Profile from "../components/Profile.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Registration,
    meta: {
      guest: true,
    },
  },
  {
    path: "/health-management",
    name: "HealthManagement",
    component: HealthManagement,
    meta: { requiresAuth: true },
  },
  {
    path: "/activity-reports",
    name: "ActivityReports",
    component: ActivityReports,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    redirect: (to) => {
      const token = localStorage.getItem("token");
      return token ? "/health-management" : "/login";
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: (to) => {
      const token = localStorage.getItem("token");
      return token ? "/health-management" : "/login";
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    return next({ name: "Login" });
  }

  if (to.matched.some((record) => record.meta.guest) && token) {
    return next({ path: "/health-management" });
  }
  next();
});

export default router;
