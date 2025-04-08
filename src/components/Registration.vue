<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { useRegistrationStore } from "../stores/registration";
import { useSnackbarStore } from "../stores/snackbar";
import BaseInput from "../base-component/baseInput.vue";
import {
  TimeRangesForNotification,
  Lifestyle,
  CommonDiseases,
  Gender,
} from "../enums/healthEnums";
import BaseSelect from "../base-component/BaseSelect.vue";
import { MESSAGE } from "../constants/communMessage";
import { AUTH_LABELS } from "../constants/authLable";
import { StatusCodes } from "http-status-codes";
import { handleApiError } from "../commonFunctions/commonFunction";

const router = useRouter();
const registrationStore = useRegistrationStore();
const snackbarStore = useSnackbarStore();

interface FormData {
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  calories_intake: number | null;
  water_intake: number | null;
  notification_time: TimeRangesForNotification;
  lifestyle: Lifestyle | null;
  existing_diseases: CommonDiseases | null;
  password: string;
  device_token: string;
}

const notificationTimeOptions = [
  { text: "Every 1 hour", value: TimeRangesForNotification.H1 },
  { text: "Every 4 hours", value: TimeRangesForNotification.H4 },
  { text: "Every 8 hours", value: TimeRangesForNotification.H8 },
  { text: "Every 12 hours", value: TimeRangesForNotification.H12 },
  { text: "Every 16 hours", value: TimeRangesForNotification.H16 },
  { text: "Every 20 hours", value: TimeRangesForNotification.H20 },
  { text: "Every 24 hours", value: TimeRangesForNotification.H24 },
];

const formData = ref<FormData>({
  name: "",
  email: "",
  phone_number: "",
  gender: "",
  age: null,
  weight: null,
  height: null,
  calories_intake: null,
  water_intake: null,
  notification_time: TimeRangesForNotification.H12,
  lifestyle: null,
  existing_diseases: null,
  password: "",
  device_token: "web-device-token",
});

const isFormSubmitted = ref(false);

const genderOptions = Object.values(Gender);
const weightOptions = Array.from({ length: 150 }, (_, i) => i + 30);
const heightOptions = Array.from({ length: 100 }, (_, i) => i + 100);
const lifestyleOptions = Object.values(Lifestyle);
const diseaseOptions = Object.values(CommonDiseases);

const rules = {
  name: {
    required: helpers.withMessage(`Name ${MESSAGE.IS_REQUIRED}`, required),
  },
  email: {
    required: helpers.withMessage(`Email ${MESSAGE.IS_REQUIRED}`, required),
    email: helpers.withMessage(`${MESSAGE.EMAIL_VALIDATE}`, email),
  },
  phone_number: {
    required: helpers.withMessage(
      `Phone number ${MESSAGE.IS_REQUIRED}`,
      required
    ),
    validPhone: helpers.withMessage(
      `${MESSAGE.NUMBER_VALIDATE}`,
      (val: string) => /^[0-9]{10}$/.test(val)
    ),
  },
  password: {
    required: helpers.withMessage(`Password ${MESSAGE.IS_REQUIRED}`, required),
    validPassword: helpers.withMessage(
      `${MESSAGE.VALIDATE_PASSWORD}`,
      (val: string) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/.test(val)
    ),
  },
  age: {
    required: helpers.withMessage(`Age ${MESSAGE.IS_REQUIRED}`, required),
  },
  height: {
    required: helpers.withMessage(`Height ${MESSAGE.IS_REQUIRED}`, required),
  },
  weight: {
    required: helpers.withMessage(`Weight ${MESSAGE.IS_REQUIRED}`, required),
  },
  calories_intake: {
    required: helpers.withMessage(
      `Calorie Goal ${MESSAGE.IS_REQUIRED}`,
      required
    ),
  },
  water_intake: {
    required: helpers.withMessage(
      `Water Goal ${MESSAGE.IS_REQUIRED}`,
      required
    ),
  },
  gender: {
    required: helpers.withMessage(`Gender ${MESSAGE.IS_REQUIRED}`, required),
  },
  notification_time: {
    required: helpers.withMessage(
      `Notification ${MESSAGE.IS_REQUIRED}`,
      required
    ),
  },
  lifestyle: {
    required: helpers.withMessage(
      `Lifestyle & Habits ${MESSAGE.IS_REQUIRED}`,
      required
    ),
  },
  existing_diseases: {
    required: helpers.withMessage(`Disease ${MESSAGE.IS_REQUIRED}`, required),
  },
};

const v$ = useVuelidate(rules, formData);

const handleSubmit = async () => {
  v$.value.$touch();

  if (v$.value.$invalid) return;

  isFormSubmitted.value = true;

  const formDataToSend: any = {
    ...formData.value,
    notification_time: String(formData.value.notification_time),
  };

  try {
    const register = await registrationStore.register(formDataToSend);

    if (register.statusCode === StatusCodes.CREATED) {
      snackbarStore.showMessage(register.message);
      router.push("/login");
    } else if (register.statusCode === StatusCodes.CONFLICT) {
      snackbarStore.showMessage(register.message, "error");
    }
  } catch (error: any) {
    handleApiError(error);
  } finally {
    isFormSubmitted.value = false;
  }
};
</script>

<template>
  <div class="register-container">
    <v-container>
      <div class="d-flex justify-end">
        <div class="register-form">
          <h5 class="text-h5 mb-6 bg-heading">
            {{ AUTH_LABELS.registration }}
          </h5>
          <v-form @submit.prevent="handleSubmit">
            <v-row>
              <v-col cols="12" md="6">
                <BaseInput
                  v-model="formData.name"
                  :label="AUTH_LABELS.name"
                  :error="v$.name.$error"
                  :error-messages="v$.name.$errors.map((e) => e.$message)"
                  @blur="v$.name.$touch()"
                />
              </v-col>

              <v-col cols="12" md="6">
                <BaseInput
                  v-model="formData.email"
                  :label="AUTH_LABELS.email"
                  :error="v$.email.$error"
                  :error-messages="v$.email.$errors.map((e) => e.$message)"
                  @blur="v$.email.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <BaseInput
                  v-model="formData.password"
                  :label="AUTH_LABELS.password"
                  type="password"
                  :error="v$.password.$error"
                  :error-messages="v$.password.$errors.map((e) => e.$message)"
                  @blur="v$.password.$touch()"
                />
              </v-col>

              <v-col cols="12" md="4">
                <BaseInput
                  v-model="formData.phone_number"
                  :label="AUTH_LABELS.phoneNumber"
                  :error="v$.phone_number.$error"
                  :error-messages="
                    v$.phone_number.$errors.map((e) => e.$message)
                  "
                  @blur="v$.phone_number.$touch()"
                />
              </v-col>

              <v-col cols="12" md="4">
                <BaseSelect
                  v-model="formData.gender"
                  :items="genderOptions"
                  :label="AUTH_LABELS.gender"
                  :error="v$.gender.$error"
                  :error-messages="v$.gender.$errors.map((e) => e.$message)"
                  @blur="v$.gender.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <BaseInput
                  v-model.number="formData.age"
                  :label="AUTH_LABELS.age"
                  type="number"
                  :error="v$.age.$error"
                  :error-messages="v$.age.$errors.map((e) => e.$message)"
                  @blur="v$.age.$touch()"
                />
              </v-col>

              <v-col cols="12" md="4">
                <BaseSelect
                  v-model="formData.height"
                  :items="heightOptions"
                  :label="AUTH_LABELS.height + ' (cm)'"
                  :error="v$.height.$error"
                  :error-messages="v$.height.$errors.map((e) => e.$message)"
                  @blur="v$.height.$touch()"
                />
              </v-col>

              <v-col cols="12" md="4">
                <BaseSelect
                  v-model="formData.weight"
                  :items="weightOptions"
                  :label="AUTH_LABELS.weight + ' (kg)'"
                  :error="v$.weight.$error"
                  :error-messages="v$.weight.$errors.map((e) => e.$message)"
                  @blur="v$.weight.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <BaseInput
                  v-model.number="formData.calories_intake"
                  :label="AUTH_LABELS.caloriesGoal"
                  type="number"
                  :error="v$.calories_intake.$error"
                  :error-messages="
                    v$.calories_intake.$errors.map((e) => e.$message)
                  "
                  @blur="v$.calories_intake.$touch()"
                />
              </v-col>

              <v-col cols="12" md="4">
                <BaseInput
                  v-model.number="formData.water_intake"
                  :label="AUTH_LABELS.waterGoal + ' (liters)'"
                  type="number"
                  :error="v$.water_intake.$error"
                  :error-messages="
                    v$.water_intake.$errors.map((e) => e.$message)
                  "
                  @blur="v$.water_intake.$touch()"
                />
              </v-col>

              <v-col cols="12" md="4">
                <BaseSelect
                  v-model="formData.notification_time"
                  :items="notificationTimeOptions"
                  :label="AUTH_LABELS.alertInterval"
                  :error="v$.notification_time.$error"
                  :error-messages="
                    v$.notification_time.$errors.map((e) => e.$message)
                  "
                  @blur="v$.notification_time.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <BaseSelect
                  v-model="formData.lifestyle"
                  :items="lifestyleOptions"
                  :label="AUTH_LABELS.lifestyle"
                  :error="v$.lifestyle.$error"
                  :error-messages="v$.lifestyle.$errors.map((e) => e.$message)"
                  @blur="v$.lifestyle.$touch()"
                />
              </v-col>

              <v-col cols="12" md="6">
                <BaseSelect
                  v-model="formData.existing_diseases"
                  :items="diseaseOptions"
                  :label="AUTH_LABELS.diseases"
                  :error="v$.existing_diseases.$error"
                  :error-messages="
                    v$.existing_diseases.$errors.map((e) => e.$message)
                  "
                  @blur="v$.existing_diseases.$touch()"
                />
              </v-col>
            </v-row>
            <div class="d-flex justify-center">
              <div class="btn-width">
                <v-btn
                  color="primary"
                  type="submit"
                  block
                  size="large"
                  rounded
                  class="mt-6 rounded-lg"
                  :loading="isFormSubmitted"
                  :disabled="isFormSubmitted"
                >
                  {{ AUTH_LABELS.submit }}
                </v-btn>
              </div>
            </div>
            <div class="text-center mt-4">
              {{ AUTH_LABELS.alreadyHaveAccount }}
              <router-link
                to="/login"
                class="text-decoration-none text-primary"
              >
                {{ AUTH_LABELS.login }}
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
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: end;
  background: url("/background.png") no-repeat;
  background-size: cover;
  padding: 20px;
}

.register-form {
  background: white;
  padding: 25px;
  border-radius: 16px;
  width: 100%;
  max-width: 670px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .register-form {
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

.gender-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.gender-fieldset legend {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}
</style>
