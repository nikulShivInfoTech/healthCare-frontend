import { defineStore } from "pinia";

interface SnackbarState {
  show: boolean;
  text: string;
  color: "success" | "error" | "info" | "warning";
  timeout: number;
}

export const useSnackbarStore = defineStore("snackbar", {
  state: (): SnackbarState => ({
    show: false,
    text: "",
    color: "success",
    timeout: 3000,
  }),

  actions: {
    showMessage(
      text: string,
      color: "success" | "error" | "info" | "warning" = "success",
      timeout: number = 3000
    ) {
      this.text = text;
      this.color = color;
      this.timeout = timeout;
      this.show = true;
    },

    hide() {
      this.show = false;
    },
  },
});
