import { createRouter, createWebHistory } from "vue-router";
import HealthManagement from "../components/HealthManagement.vue";
import NotFound from "../components/NotFound.vue";
import ActivityReports from "../components/ActivityReports.vue";
import Profile from "../components/Profile.vue";
const routes = [
  {
    path: "/",
    name: "HealthManagement",
    component: HealthManagement,
    meta: { requiresAuth: true },
  },
  {
    path: "/Activity",
    name: "Activity",
    component: ActivityReports,
    meta: { requiresAuth: true },
  },
  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
