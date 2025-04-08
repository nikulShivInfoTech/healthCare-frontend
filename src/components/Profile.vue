<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { useProfileStore } from "../stores/profile";
import { storeToRefs } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import BaseInput from "../base-component/BaseInput.vue";
import BaseSelect from "../base-component/BaseSelect.vue";
import { MESSAGE, MESSAGE_PROFILE } from "../constants/communMessage";
import {
  TimeRangesForNotification,
  Lifestyle,
  CommonDiseases,
  Gender,
} from "../enums/healthEnums";
import { AUTH_LABELS } from "../constants/authLable";

const profileStore = useProfileStore();
const { userProfile, loading, error, isEditing } = storeToRefs(profileStore);

const notificationTimeOptions = [
  { text: "Every 1 hour", value: TimeRangesForNotification.H1 },
  { text: "Every 4 hours", value: TimeRangesForNotification.H4 },
  { text: "Every 8 hours", value: TimeRangesForNotification.H8 },
  { text: "Every 12 hours", value: TimeRangesForNotification.H12 },
  { text: "Every 16 hours", value: TimeRangesForNotification.H16 },
  { text: "Every 20 hours", value: TimeRangesForNotification.H20 },
  { text: "Every 24 hours", value: TimeRangesForNotification.H24 },
];

const genderOptions = Object.values(Gender);
const weightOptions = Array.from({ length: 150 }, (_, i) => i + 30);
const heightOptions = Array.from({ length: 100 }, (_, i) => i + 100);
const lifestyleOptions = Object.values(Lifestyle);
const diseaseOptions = Object.values(CommonDiseases);

interface UserProfile {
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  height: number;
  weight: number;
  age: number;
  calories_intake: number;
  notification_time: string;
  water_intake: number;
  lifestyle: string;
  existing_diseases: string;
}

interface EditFormData {
  name: string;
  phone_number: string;
  gender: string;
  height: number;
  weight: number;
  age: number;
  calories_intake: number;
  notification_time: string;
  water_intake: number;
  lifestyle: string;
  existing_diseases: string;
}

const editFormData = reactive<EditFormData>({
  name: "",
  phone_number: "",
  gender: "",
  height: 0,
  weight: 0,
  age: 0,
  calories_intake: 0,
  notification_time: "",
  water_intake: 0,
  lifestyle: "",
  existing_diseases: "",
});

const rules = {
  name: {
    required: helpers.withMessage(
      `Name ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
  phone_number: {
    required: helpers.withMessage(
      `Phone number ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
    validPhone: helpers.withMessage(
      `${MESSAGE.NUMBER_VALIDATE}` as string,
      (val: string) => /^[0-9]{10}$/.test(val)
    ),
  },
  age: {
    required: helpers.withMessage(
      `Age ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
  gender: {
    required: helpers.withMessage(
      `Gender ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
  height: {
    required: helpers.withMessage(
      `Height ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
  weight: {
    required: helpers.withMessage(
      `Weight ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
  calories_intake: {
    required: helpers.withMessage(
      `Calories Intake ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
  water_intake: {
    required: helpers.withMessage(
      `Water Intake ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
  notification_time: {
    required: helpers.withMessage(
      `Notification Time ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
  lifestyle: {
    required: helpers.withMessage(
      `Lifestyle ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
  existing_diseases: {
    required: helpers.withMessage(
      `Existing Diseases ${MESSAGE.IS_REQUIRED}` as string,
      required
    ),
  },
};

const v$ = useVuelidate(rules, editFormData);

const getErrorMessages = (errors: any[]): string[] => {
  return errors.map((e) => String(e.$message));
};

onMounted(async () => {
  await profileStore.fetchUserProfile();
  if (userProfile.value) {
    const {
      name,
      phone_number,
      gender,
      height,
      weight,
      age,
      calories_intake,
      notification_time,
      water_intake,
      lifestyle,
      existing_diseases,
    } = userProfile.value;

    Object.assign(editFormData, {
      name,
      phone_number,
      gender,
      height,
      weight,
      age,
      calories_intake,
      notification_time,
      water_intake,
      lifestyle,
      existing_diseases,
    });
  }
});

const handleSubmit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  const response = await profileStore.updateProfile(editFormData);
  if (response?.statusCode === 202) {
    await profileStore.fetchUserProfile();
  }
};
</script>

<template>
  <div class="profile-container">
    <v-container>
      <div class="profile-content">
        <div
          class="d-flex justify-space-between align-center bg-white py-5 px-8 rounded-lg mb-2"
        >
          <h1 class="text-h5">
            {{
              isEditing ? MESSAGE_PROFILE.editProfile : MESSAGE_PROFILE.profile
            }}
          </h1>
          <v-btn
            color="primary"
            variant="outlined"
            class="text-capitalize"
            rounded
            @click="profileStore.toggleEditMode()"
            :disabled="loading"
          >
            {{
              isEditing ? MESSAGE_PROFILE.cancel : MESSAGE_PROFILE.editProfile
            }}
          </v-btn>
        </div>

        <v-card v-if="!userProfile && loading" class="pa-4 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
          <div class="mt-2">
            {{ MESSAGE_PROFILE.loading }}
          </div>
        </v-card>

        <v-card v-else-if="error" class="pa-4 text-center error-card">
          <v-icon color="error" size="40">mdi-alert-circle</v-icon>
          <div class="mt-2">
            {{ MESSAGE_PROFILE.apiFailed }}
          </div>
          <v-btn
            color="primary"
            class="mt-4"
            @click="profileStore.fetchUserProfile"
          >
            Retry
          </v-btn>
        </v-card>

        <template v-else-if="userProfile">
          <div v-if="isEditing" class="user-info-card mb-4">
            <v-form
              @submit.prevent="handleSubmit"
              class="bg-white rounded-lg px-8"
            >
              <v-row>
                <v-col cols="12" md="4">
                  <BaseInput
                    v-model="editFormData.name"
                    :label="AUTH_LABELS.name"
                    :error="v$.name.$error"
                    :error-messages="getErrorMessages(v$.name.$errors)"
                    @blur="v$.name.$touch()"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <BaseInput
                    :model-value="userProfile?.email"
                    :label="AUTH_LABELS.email"
                    :disabled="true"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <BaseInput
                    v-model="editFormData.phone_number"
                    :label="AUTH_LABELS.phoneNumber"
                    :error="v$.phone_number.$error"
                    :error-messages="getErrorMessages(v$.phone_number.$errors)"
                    @blur="v$.phone_number.$touch()"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <BaseSelect
                    v-model="editFormData.gender"
                    :items="genderOptions"
                    :label="AUTH_LABELS.gender"
                    :error="v$.gender.$error"
                    :error-messages="getErrorMessages(v$.gender.$errors)"
                    @blur="v$.gender.$touch()"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <BaseInput
                    v-model="editFormData.age"
                    :label="AUTH_LABELS.age"
                    type="number"
                    :error="v$.age.$error"
                    :error-messages="getErrorMessages(v$.age.$errors)"
                    @blur="v$.age.$touch()"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <BaseSelect
                    v-model="editFormData.height"
                    :items="heightOptions"
                    :label="AUTH_LABELS.height + ' (cm)'"
                    :error="v$.height.$error"
                    :error-messages="getErrorMessages(v$.height.$errors)"
                    @blur="v$.height.$touch()"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <BaseSelect
                    v-model="editFormData.weight"
                    :items="weightOptions"
                    :label="AUTH_LABELS.weight + ' (kg)'"
                    :error="v$.weight.$error"
                    :error-messages="getErrorMessages(v$.weight.$errors)"
                    @blur="v$.weight.$touch()"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <BaseInput
                    v-model="editFormData.calories_intake"
                    :label="AUTH_LABELS.caloriesGoal"
                    type="number"
                    :error="v$.calories_intake.$error"
                    :error-messages="
                      getErrorMessages(v$.calories_intake.$errors)
                    "
                    @blur="v$.calories_intake.$touch()"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <BaseInput
                    v-model="editFormData.water_intake"
                    :label="AUTH_LABELS.waterGoal + ' (liters)'"
                    type="number"
                    :error="v$.water_intake.$error"
                    :error-messages="getErrorMessages(v$.water_intake.$errors)"
                    @blur="v$.water_intake.$touch()"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <BaseSelect
                    v-model="editFormData.notification_time"
                    :items="notificationTimeOptions"
                    :label="AUTH_LABELS.alertInterval"
                    :error="v$.notification_time.$error"
                    :error-messages="
                      getErrorMessages(v$.notification_time.$errors)
                    "
                    @blur="v$.notification_time.$touch()"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <BaseSelect
                    v-model="editFormData.lifestyle"
                    :items="lifestyleOptions"
                    :label="AUTH_LABELS.lifestyle"
                    :error="v$.lifestyle.$error"
                    :error-messages="getErrorMessages(v$.lifestyle.$errors)"
                    @blur="v$.lifestyle.$touch()"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <BaseSelect
                    v-model="editFormData.existing_diseases"
                    :items="diseaseOptions"
                    :label="AUTH_LABELS.diseases"
                    :error="v$.existing_diseases.$error"
                    :error-messages="
                      getErrorMessages(v$.existing_diseases.$errors)
                    "
                    @blur="v$.existing_diseases.$touch()"
                  />
                </v-col>
              </v-row>

              <div class="d-flex justify-center mt-6">
                <v-btn
                  color="primary"
                  type="submit"
                  class="text-capitalize"
                  :loading="loading"
                  :disabled="loading"
                  min-width="200"
                  rounded
                >
                  {{ MESSAGE_PROFILE.update }}
                </v-btn>
              </div>
            </v-form>
          </div>

          <div v-else class="user-info-card mb-4">
            <div class="user-header">
              <v-avatar size="80" color="grey-lighten-1">
                <v-icon size="40">mdi-account</v-icon>
              </v-avatar>
              <div class="user-id">
                <div class="text-h6">
                  {{ userProfile.name }}
                </div>
              </div>
            </div>

            <v-row class="mt-8">
              <v-col cols="12" md="4">
                <div class="info-group">
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.name }}</div>
                    <div class="value">{{ userProfile.name }}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.email }}</div>
                    <div class="value">{{ userProfile.email }}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.phoneNumber }}</div>
                    <div class="value">{{ userProfile.phone_number }}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.age }}</div>
                    <div class="value">{{ userProfile.age }}</div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div class="info-group">
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.gender }}</div>
                    <div class="value">{{ userProfile.gender }}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.height }}</div>
                    <div class="value">{{ userProfile.height }} cm</div>
                  </div>
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.weight }}</div>
                    <div class="value">{{ userProfile.weight }} kg</div>
                  </div>
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.caloriesGoal }}</div>
                    <div class="value">
                      {{ userProfile.calories_intake }} kcal
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div class="info-group">
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.waterGoal }}</div>
                    <div class="value">
                      {{ userProfile.water_intake }} liters
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.lifestyle }}</div>
                    <div class="value">{{ userProfile.lifestyle }}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.diseases }}</div>
                    <div class="value">{{ userProfile.existing_diseases }}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">{{ AUTH_LABELS.alertInterval }}</div>
                    <div class="value">{{ userProfile.notification_time }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </template>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 90vh;
  background: url("/profile-background.png") no-repeat;
  background-size: cover;
  padding: 20px;
}

.profile-content {
  position: relative;
  padding-top: 20px;
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 0;
}

.user-info-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.user-id {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1rem;
}

.value {
  font-size: 1rem;
  font-weight: 500;
}

@media (max-width: 600px) {
  .user-info-card {
    padding: 20px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.edit-form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
