<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  type?: "text" | "number" | "textarea";
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <Field
      :as="props.type === 'textarea' ? 'textarea' : 'input'"
      :name="props.name"
      :type="props.type || 'text'"
      :disabled="props.disabled"
      class="input w-full"
      :class="{
        'input-error': props.error,
        'input': !type || type === 'text',
        'textarea': type === 'textarea',
      }"
    />
    <p v-if="props.error" class="label">
      {{ props.error }}
    </p>
  </fieldset>
</template>
