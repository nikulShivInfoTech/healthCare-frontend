<script setup>
import { defineProps, defineEmits, ref, computed, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";

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
  rules: {
    type: Object,
    default: () => ({}),
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  minLength: {
    type: Number,
    default: 0,
  },
  isEmail: {
    type: Boolean,
    default: false,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const state = ref({
  value: props.modelValue,
});

const validations = computed(() => {
  const rules = { ...props.rules };

  if (props.isRequired) {
    rules.required = helpers.withMessage(
      `${props.fieldName} is required`,
      required
    );
  }

  if (props.isEmail) {
    rules.email = helpers.withMessage(
      "Please enter a valid email address",
      email
    );
  }

  return {
    value: rules,
  };
});

const v$ = useVuelidate(validations, state);

watch(
  () => props.isSubmitted,
  (newVal) => {
    if (newVal) {
      v$.value.$touch();
    }
  }
);

const updateValue = (value) => {
  state.value.value = value;
  emit("update:modelValue", value);
  v$.value.$touch();
};

const errorMessages = computed(() => {
  if (v$.value.$error) {
    return v$.value.$errors.map((error) => error.$message);
  }
  return [];
});
</script>

<template>
  <div>
    <v-text-field
      :class="props.classes"
      :label="props.label"
      variant="outlined"
      class=""
      :model-value="state.value"
      @update:modelValue="updateValue"
      :error-messages="errorMessages"
      :error="v$.value.$error"
    />
  </div>
</template>

<style>
.v-field__input {
  padding-top: 3px !important;
  padding-bottom: 3px !important;
}
</style>
