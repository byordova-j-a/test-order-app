<template>
  <div
    class="form-button"
    :class="{ 'button-disabled': componentProps.disabled }"
    @click="clickHandler"
  >
    {{ componentProps.text }}
  </div>
</template>

<script setup lang="ts">
type TComponentProps = {
  text: string;
  disabled?: boolean;
};

const componentProps = withDefaults(defineProps<TComponentProps>(), {
  disabled: false
});
const componentEmits = defineEmits<{ (e: 'click'): void }>();
const clickHandler = () => {
  if (componentProps.disabled) return;
  componentEmits('click');
};
</script>

<style scoped>
.form-button {
  padding: 10px 20px;
  width: min-content;
  border-radius: 10px;
  user-select: none;
  cursor: pointer;
  text-wrap: nowrap;
  background-color: #b6c6ec;
}

.form-button:not(.button-disabled):hover {
  background-color: rgb(138, 166, 227);
}

.button-disabled {
  pointer-events: none;
  background-color: #9799a1;
}
</style>
