
<script setup>
import Layout from './components/Layout.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
    <div>
        <!-- Show Layout only if not on the Login page -->
        <Layout v-if="route.name !== 'Login'" />
        <!-- Always show the routed component -->
        <router-view v-if="route.name == 'Login'" />
    </div>
</template>
<style scoped>
.v-icon {
    left: -50px !important;
}
</style>
