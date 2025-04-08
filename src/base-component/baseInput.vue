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
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  inputSize: {
    type: String,
    default: "compact",
  },
  errorMessages: {
    type: Array,
    default: () => [],
  },
  error: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);
const updateValue = (value) => {
  emit("update:modelValue", value);
};

defineOptions({
  name: "BaseInput",
});
</script>

<template>
  <div>
    <v-text-field
      :class="props.classes"
      :label="props.label"
      variant="outlined"
      :model-value="props.modelValue"
      :type="props.type"
      @update:modelValue="updateValue"
      @blur="$emit('blur')"
      :error-messages="errorMessages"
      :error="error"
      :density="inputSize"
      :disabled="disabled"
    />
  </div>
</template>

<style>
.v-field__input {
  padding-top: 3px !important;
  padding-bottom: 3px !important;
}
</style>
