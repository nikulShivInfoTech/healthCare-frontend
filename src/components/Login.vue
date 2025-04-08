<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import BaseInput from "../base-component/baseInput.vue";
import { useLoginStore } from "../stores/login";
import { useSnackbarStore } from "../stores/snackbar";
import { MESSAGE } from "../constants/communMessage";
import { AUTH_LABELS } from "../constants/authLable";

const router = useRouter();
const loginStore = useLoginStore();
const snackbarStore = useSnackbarStore();

interface LoginForm {
  email: string;
  password: string;
}

const formData = ref<LoginForm>({
  email: "",
  password: "",
});

const isFormSubmitted = ref(false);

const rules = {
  email: {
    required: helpers.withMessage(`Email ${MESSAGE.IS_REQUIRED}`, required),
    email: helpers.withMessage(`${MESSAGE.EMAIL_VALIDATE}`, email),
  },
  password: {
    required: helpers.withMessage(`Password ${MESSAGE.IS_REQUIRED}`, required),
    validPassword: helpers.withMessage(
      `${MESSAGE.VALIDATE_PASSWORD}`,
      (val: string) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/.test(val)
    ),
  },
};

const v$ = useVuelidate(rules, formData);

const handleSubmit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  isFormSubmitted.value = true;

  try {
    const loginResponse = await loginStore.login(formData.value);

    if (loginResponse.statusCode === 200) {
      snackbarStore.showMessage(loginResponse.message || "Login successful!");
      router.push("/health-management");
    }
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (Array.isArray(errorData.message)) {
        snackbarStore.showMessage(errorData.message[0], "error");
      } else if (errorData.message) {
        snackbarStore.showMessage(errorData.message, "error");
      }
    }
  } finally {
    isFormSubmitted.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <v-container>
      <div class="d-flex justify-end">
        <div class="login-form">
          <h5 class="text-h5 mb-6 bg-heading">Login</h5>
          <v-form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <BaseInput
                v-model="formData.email"
                :label="AUTH_LABELS.email"
                :error="v$.email.$error"
                :error-messages="v$.email.$errors.map((e) => e.$message)"
                @blur="v$.email.$touch()"
                inputSize="default"
              />
            </div>

            <div class="mb-2">
              <BaseInput
                v-model="formData.password"
                type="password"
                :label="AUTH_LABELS.password"
                :error="v$.password.$error"
                :error-messages="v$.password.$errors.map((e) => e.$message)"
                @blur="v$.password.$touch()"
                inputSize="default"
              />
            </div>
            <div class="d-flex justify-center">
              <div class="btn-width">
                <v-btn
                  color="primary"
                  type="submit"
                  block
                  size="large"
                  rounded
                  class="mt-2 rounded-lg"
                  :loading="isFormSubmitted"
                  :disabled="isFormSubmitted"
                >
                  {{ AUTH_LABELS.login }}
                </v-btn>
              </div>
            </div>

            <div class="text-center mt-4">
              {{ AUTH_LABELS.dontHaveAccount }}
              <router-link
                to="/register"
                class="text-decoration-none text-primary"
              >
                {{ AUTH_LABELS.register }}
              </router-link>
            </div>
          </v-form>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.btn-width {
  min-width: 60% !important;
}
.bg-heading {
  background-color: #ceeaf2;
  padding: 10px 20px;
  border-radius: 15px;
  font-weight: 600;
  color: #5c8e9c;
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: end;
  background: url("/background.png") no-repeat;
  background-size: cover;
  padding: 20px;
}

.login-form {
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .login-form {
    padding: 20px;
  }
}

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
