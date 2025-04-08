<script setup lang="ts">
import Layout from "./components/Layout.vue";
import { useRoute } from "vue-router";
import GlobalSnackbar from "./components/GlobalSnackbar.vue";

const route = useRoute();
const publicRoutes: string[] = ["Login", "Register"];
</script>
<template>
  <v-app>
    <div>
      <router-view
        v-if="route.name && publicRoutes.includes(String(route.name))"
      />
      <Layout v-else>
        <router-view />
      </Layout>
    </div>
    <GlobalSnackbar />
  </v-app>
</template>
<style scoped>
.v-icon {
  left: -50px !important;
}
</style>
