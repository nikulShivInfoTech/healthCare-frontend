<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

type Variant =
  | "outlined"
  | "plain"
  | "filled"
  | "underlined"
  | "solo"
  | "solo-inverted"
  | "solo-filled";
type Density = "default" | "comfortable" | "compact";

const props = defineProps({
  modelValue: [String, Number, Object, null],
  label: {
    type: String,
    default: "",
  },
  items: {
    type: Array,
    required: true,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: Array as () => string[],
    default: () => [],
  },
  variant: {
    type: String as () => Variant,
    default: "outlined",
  },
  dense: {
    type: Boolean,
    default: false,
  },
  returnObject: {
    type: Boolean,
    default: false,
  },
  inputSize: {
    type: String as () => Density,
    default: "compact",
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);

const updateValue = (val: any) => {
  emit("update:modelValue", val);
};

defineOptions({
  name: "BaseSelect",
});
</script>

<template>
  <v-select
    :label="label"
    :items="items"
    :model-value="modelValue"
    :error="error"
    :error-messages="errorMessages"
    :variant="variant"
    :dense="dense"
    :return-object="returnObject"
    item-title="text"
    item-value="value"
    @update:modelValue="updateValue"
    @blur="$emit('blur')"
    :density="inputSize"
  />
</template>
