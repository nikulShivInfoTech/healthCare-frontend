<script setup>
import { defineProps, defineEmits, ref } from "vue";

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
  errorMessages: {
    type: Array,
    default: () => [],
  },
  error: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (value) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <div>
    <v-text-field
      :class="props.classes"
      :label="props.label"
      variant="outlined"
      :model-value="props.modelValue"
      @update:modelValue="updateValue"
      :error-messages="errorMessages"
      :error="error"
    />
  </div>
</template>

<style>
.v-field__input {
  padding-top: 3px !important;
  padding-bottom: 3px !important;
}
</style>
