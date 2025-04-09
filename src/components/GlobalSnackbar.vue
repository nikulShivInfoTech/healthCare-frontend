<script setup lang="ts">
import { useSnackbarStore } from "../stores/snackbar";

const snackbarStore = useSnackbarStore();
</script>

<template>
  <v-snackbar
    v-model="snackbarStore.show"
    :color="snackbarStore.color"
    :timeout="snackbarStore.timeout"
    location="top right"
    class="snackbar-custom"
  >
    {{ snackbarStore.text }}

    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="snackbarStore.hide()"
        icon="mdi-close"
        size="small"
      />
    </template>
  </v-snackbar>
</template>

<style scoped>
:deep(.snackbar-custom) {
  margin-top: 20px !important;
  margin-right: 20px !important;
}

:deep(.v-snackbar__content) {
  padding: 12px !important;
  min-height: unset !important;
}

:deep(.v-snackbar__actions) {
  margin-inline-start: 8px !important;
  padding-inline-start: 0 !important;
}
</style>
