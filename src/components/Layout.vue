<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const drawer = ref(true);

const router = useRouter();

const navItems = [
  {
    icon: "mdi-monitor-account",
    title: "Health Management",
    value: "/",
  },
  {
    icon: "mdi-chart-line",
    title: "Activity Reports",
    value: "/Activity",
  },
  {
    icon: "mdi-face-man-shimmer",
    title: "Profile",
    value: "/Profile",
  },
];

const handleLogOut = () => {
  localStorage.removeItem("token");
  router.push({ name: "Login" });
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
      <v-app-bar color="" prominent>
        <v-app-bar-nav-icon
          color="primary"
          class="d-flex justify-center pe-5"
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <img class="width-logo" src="/public/logo.png" alt="" />
        <v-toolbar-title class="">Health Care</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              icon="mdi-dots-vertical pe-5"
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

      <v-navigation-drawer v-if="drawer" expand-on-hover rail v-model="drawer">
        <v-list class="center-image">
          <v-list-item text-center class="drawer-logo">
            <img
              :class="drawerHover ? 'img1' : 'img2'"
              :src="
                drawerHover
                  ? 'https://e-commerce-six-livid-87.vercel.app/static/media/logo-light.b1c70f9820f852e7b372.png'
                  : 'https://e-commerce-six-livid-87.vercel.app/static/media/logo-sm.3076a99ed30444af5790.png'
              "
              alt="Logo"
              class="logo-image"
              width="30px"
            />
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            v-for="(item, index) in navItems"
            :key="index"
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item.value"
            @click="handleNavClick(item)"
          >
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-card-text>
          <router-view></router-view>
        </v-card-text>
      </v-main>
    </v-layout>
  </v-card>
  <v-footer
    color="#151529"
    class="align-center justify-space-between d-flex footer text-grey"
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
.v-toolbar__content > .v-btn:first-child {
  padding-left: 18px;
  margin-inline-start: 4px;
}

.width-logo {
  width: 100px;
  padding: 10px 0px 10px 10px;
}

.v-toolbar__content > .v-btn:last-child {
  padding-left: 18px;
  margin-inline-end: 4px;
}

.white >>> .Nopading {
  padding: 0px !important;
}

.customBtn {
  width: 100px !important;
}

::v-deep(.v-list-item__content) {
  align-self: center;
  grid-area: content;
  overflow: visible !important;
}

::v-deep(.mdi-view-dashboard, .mdi-package-variant, .mdi-shape) {
  left: 6px !important;
}

::v-deep(.mdi-package-variant, .mdi-shape) {
  left: 6px !important;
}

::v-deep(.mdi-shape) {
  left: 6px !important;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100vw;
  padding-left: 2rem;
  font-size: 13px;
  z-index: -0;
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

.v-card-text {
  padding: 0px !important;
}

::v-deep(.v-navigation-drawer__content) {
  background-color: #151529;
  color: #fff;
}

.drawer-logo img {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
::v-deep(.v-navigation-drawer) {
  width: 65px;
}

.v-navigation-drawer:hover .drawer-logo img {
  width: 100px;
  content: url("https://e-commerce-six-livid-87.vercel.app/static/media/logo-light.b1c70f9820f852e7b372.png");
}
.center-image {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.v-navigation-drawer {
  width: 70px !important;
}
.v-navigation-drawer:hover {
  width: 250px !important;
}
</style>
