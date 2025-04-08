<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";

const drawer = ref(true);
const drawerHover = ref(false);
const router = useRouter();
const route = useRoute();

const navItems = [
  {
    icon: "mdi-monitor-account",
    title: "Health Management",
    value: "/health-management",
  },
  {
    icon: "mdi-chart-line",
    title: "Activity Reports",
    value: "/activity-reports",
  },
  {
    icon: "mdi-face-man-shimmer",
    title: "Profile",
    value: "/profile",
  },
];

const handleLogOut = () => {
  localStorage.removeItem("token");
  router.push("/register");
};

const profileItems = [
  {
    title: "Log Out",
    Function: handleLogOut,
    class: "bg-error elevation-4 rounded-xl",
  },
];

const handleNavClick = (item) => {
  router.push(item.value);
};
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar color="#ECFBF6" height="64">
        <v-app-bar-nav-icon
          color="primary"
          class="d-flex justify-center"
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/logo.png" alt="Health Care Logo" class="app-logo" />
            <span class="ml-3 app-title">Health Care</span>
          </div>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              icon="mdi-dots-vertical"
              variant="text"
              v-bind="props"
            ></v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, i) in profileItems"
              :key="i"
              class="white my-1"
            >
              <v-btn
                :class="item.class"
                class="border px-2 customBtn"
                @click="item.Function"
              >
                {{ item.title }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :rail="!drawerHover"
        @mouseenter="drawerHover = true"
        @mouseleave="drawerHover = false"
        permanent
        border="end"
        class="custom-drawer"
      >
        <div class="sidebar-content">
          <!-- Logo Section -->
          <div class="logo-wrapper pa-4">
            <img
              :src="
                drawerHover
                  ? 'https://e-commerce-six-livid-87.vercel.app/static/media/logo-light.b1c70f9820f852e7b372.png'
                  : 'https://e-commerce-six-livid-87.vercel.app/static/media/logo-sm.3076a99ed30444af5790.png'
              "
              alt="Shiv Infotech"
              class="logo-image"
              :style="{ width: drawerHover ? '150px' : '35px' }"
            />
          </div>

          <v-divider class="my-2 custom-divider"></v-divider>

          <!-- Navigation Items -->
          <v-list nav density="compact" class="pa-2">
            <v-list-item
              v-for="(item, index) in navItems"
              :key="index"
              :value="item.value"
              :prepend-icon="item.icon"
              :title="item.title"
              @click="handleNavClick(item)"
              class="mb-3"
              :active="route.path === item.value"
              :class="{ 'v-list-item--active': route.path === item.value }"
              rounded="lg"
            >
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>

      <!-- Main content area -->
      <v-main style="min-height: 100vh">
        <v-card-text class="pa-0">
          <slot></slot>
        </v-card-text>
      </v-main>
    </v-layout>
  </v-card>
  <v-footer
    border
    color="#8BC9C5"
    class="align-center justify-space-between d-flex footer text-black"
  >
    <div>
      <p>© 2024 Shivinfotech.</p>
    </div>
    <div>
      <p class="me-sm-4 me-0">Design & Develop by Shivinfotech.</p>
    </div>
  </v-footer>
</template>

<style scoped>
.sidebar-content {
  background-color: #ecfbf6;
  height: 100%;
  color: black;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  height: 64px;
  padding-left: 12px;
  justify-content: center;
}

.logo-image {
  transition: all 0.3s ease;
}

.v-navigation-drawer {
  width: 70px !important;
  transition: width 0.3s ease;
}

.v-navigation-drawer:hover {
  width: 250px !important;
}

:deep(.v-list-item) {
  min-height: 44px;
  margin-bottom: 4px;
  border-radius: 8px;
}

:deep(.v-list-item--active) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.v-list-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.v-list-item__prepend) {
  padding-right: 0px;
}

:deep(.v-list-item__content) {
  opacity: 1 !important;
  font-size: 14px;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding-left: 2rem;
  font-size: 13px;
  z-index: 0;
}

.customBtn {
  width: 100px !important;
}

@media (max-width: 1279px) {
  .v-navigation-drawer__scrim {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100%;
    background: black;
    opacity: 0.2;
    z-index: 1;
  }
}

.custom-drawer {
  border-color: #8bc9c5 !important;
  border-width: 0 2px 0 0 !important;
}

.custom-divider {
  border-color: #87c7c2 !important;
  opacity: 1 !important;
}

.app-logo {
  height: 45px;
  width: auto;
  object-fit: contain;
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 24px;
  display: flex;
  align-items: center;
}
</style>

<script>
export default {
  name: "Layout",
};
</script>
