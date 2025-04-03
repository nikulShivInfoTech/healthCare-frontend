<script setup>
import { defineProps, defineEmits, ref, computed } from "vue";

const props = defineProps({
  classes: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
  fieldName: {
    type: String,
    default: "",
  },
  typeofvalidation: {
    type: Function,
    required: false,
  },
  type: {
    type: String,
    default: "text",
  },
  confirmPassword: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const errors = ref({
  common: undefined,
});

const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const requiredValidator = (value, fieldName) => {
  if (!value || value === "") {
    return `${fieldName} is required.`;
  }
  return true;
};

const passwordValidator = (value) => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(value)) {
    return "Password must be at least 8 characters long and contain both letters, numbers, and special characters like @$!%*?&.";
  }
  return true;
};

const confirmPasswordValidator = (value) => {
  if (value !== props.confirmPassword) {
    return "Passwords do not match.";
  }
  return true;
};

const emailValidator = (value) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(value)) {
    return "Please enter a valid email address.";
  }
  return true;
};

const numberValidator = (value) => {
  const numberPattern = /^[0-9]+$/;
  if (value && !numberPattern.test(value)) {
    return "Only numbers are allowed.";
  }
  return true;
};

const validate = (value) => {
  if (props.typeofvalidation) {
    const result = props.typeofvalidation(value);
    return result === true ? true : result;
  }
  return true;
};

const computedRules = computed(() => {
  let rules = [
    (value) => requiredValidator(value, props.fieldName),
    (value) => validate(value),
  ];

  if (props.type === "password") {
    rules.push(passwordValidator);
  } else if (props.type === "confirm-password") {
    rules.push(confirmPasswordValidator);
  } else if (props.type === "email") {
    rules.push(emailValidator);
  } else if (props.type === "number") {
    rules.push(numberValidator);
  }

  return rules;
});

const inputType = computed(() => {
  return props.type === "password" && !passwordVisible.value
    ? "password"
    : "text";
});

const passwordIcon = computed(() => {
  return passwordVisible.value ? "mdi-eye" : "mdi-eye-off";
});
</script>

<template>
  <div>
    <v-text-field
      v-if="props.type === 'password'"
      :class="props.classes"
      :label="props.label"
      variant="outlined"
      class=""
      :value="props.modelValue"
      @update:modelValue="(value) => emit('update:modelValue', value)"
      :rules="computedRules"
      :type="inputType"
      :error-messages="errors.common ? [errors.common] : []"
      outline
    >
      <template v-slot:append>
        <v-icon @click="togglePasswordVisibility">
          {{ passwordIcon }}
        </v-icon>
      </template>
    </v-text-field>

    <v-text-field
      v-if="props.type === 'confirm-password'"
      :class="props.classes"
      :label="props.label"
      variant="outlined"
      class=""
      :value="props.modelValue"
      @update:modelValue="(value) => emit('update:modelValue', value)"
      :rules="computedRules"
      :type="inputType"
      :error-messages="errors.common ? [errors.common] : []"
    >
      <template v-slot:append>
        <v-icon @click="togglePasswordVisibility">
          {{ passwordIcon }}
        </v-icon>
      </template>
    </v-text-field>

    <v-text-field
      v-if="props.type === 'email'"
      :class="props.classes"
      :label="props.label"
      variant="outlined"
      class=""
      :value="props.modelValue"
      @update:modelValue="(value) => emit('update:modelValue', value)"
      :rules="computedRules"
      :type="inputType"
      :error-messages="errors.common ? [errors.common] : []"
    />

    <v-text-field
      v-if="props.type === 'number'"
      :class="props.classes"
      :label="props.label"
      variant="outlined"
      class=""
      :value="props.modelValue"
      @update:modelValue="(value) => emit('update:modelValue', value)"
      :rules="computedRules"
      :type="inputType"
      :error-messages="errors.common ? [errors.common] : []"
    />

    <v-text-field
      v-if="props.type === 'text'"
      :class="props.classes"
      :label="props.label"
      variant="outlined"
      class=""
      :value="props.modelValue"
      @update:modelValue="(value) => emit('update:modelValue', value)"
      :rules="computedRules"
      :type="inputType"
      :error-messages="errors.common ? [errors.common] : []"
    />
  </div>
</template>
<style>
.v-icon {
  left: -10px !important;
}

.v-input__append {
  margin-inline-start: -24px !important;
}
.v-field__input {
  padding-top: 3px !important;
  padding-bottom: 3px !important;
}
</style>
