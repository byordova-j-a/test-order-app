<template>
  <div
    class="form-field"
    :class="'field-' + componentProps.type"
  >
    <label
      class="medium-font"
      :for="formFieldId"
      >{{ label }}:</label
    >
    <template v-if="componentProps.type === EFormFieldType.INPUT">
      <input
        v-show="componentProps.isEditMode"
        class="small-font"
        :class="{ 'invalid-state': isEmptyField }"
        :name="formFieldId"
        v-model="modelValue"
      />
      <p
        v-show="!componentProps.isEditMode"
        class="small-font"
      >
        {{ modelValue }}
      </p></template
    >
    <template v-if="componentProps.type === EFormFieldType.TEXTAREA">
      <textarea
        v-show="componentProps.isEditMode"
        class="small-font"
        :name="formFieldId"
        :class="{ 'invalid-state': isEmptyField }"
        rows="7"
        v-model="modelValue"
        maxlength="750"
      />
      <p
        v-show="!componentProps.isEditMode"
        class="small-font"
      >
        {{ modelValue }}
      </p>
    </template>

    <template v-if="componentProps.type === EFormFieldType.SELECT">
      <select
        v-show="componentProps.isEditMode"
        class="small-font"
        :name="formFieldId"
        v-model="modelValue"
      >
        <option
          v-for="{ text, value } in statusList"
          :key="value"
          :value="value"
        >
          {{ text }}
        </option>
      </select>

      <div
        v-show="!componentProps.isEditMode"
        class="small-font status"
      >
        <template
          v-for="{ text, value } in statusList"
          :key="value"
        >
          <p :class="{ active: value === modelValue }">
            {{ text }}
          </p>
          <p
            class="arrow medium-font"
            v-show="value !== EOrderStatus.COMPLETED"
          >
            &rarr;
          </p>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { EFormFieldType, EOrderStatus } from '~/types';

type TComponentProps = {
  isEditMode: boolean;
  label: string;
  type: EFormFieldType;
};

const modelValue = defineModel<string | EOrderStatus>({ required: true });
const componentProps = defineProps<TComponentProps>();

const isEmptyField = computed(() => !modelValue.value.trim());

const statusList = [
  { text: 'Черновик', value: EOrderStatus.DRAFT },
  { text: 'Опубликован', value: EOrderStatus.PUBLISHED },
  { text: 'Выполняется', value: EOrderStatus.IN_PROGRESS },
  { text: 'Завершён', value: EOrderStatus.COMPLETED }
];

const formFieldId = useId();
</script>

<style scoped>
.form-field {
  width: 100%;
  display: flex;
  gap: 10px;
  font-family: '18vag';
  font-weight: 500;
  display: flex;
}
.invalid-state {
  border-color: red;
}
.field-input {
  min-height: 34px;
}

.field-select {
  min-height: 32px;
}

.form-field label {
  text-wrap: nowrap;
}

.field-input input {
  flex-grow: 1;
  font-family: '18vag';
  font-weight: 500;
  padding: 1px 2px;
  outline: none;
  border-width: 1px;
}

.field-input p {
  padding: 3px;
  white-space: pre-wrap;
  word-break: break-all;
}

.field-textarea textarea {
  flex-grow: 1;
  font-family: '18vag';
  font-weight: 500;
  padding: 2px;
  border-width: 1px;
  outline: none;
}

.field-textarea p {
  white-space: pre-wrap;
  word-break: break-all;
  padding: 3px;
}
.field-select .status {
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-wrap: wrap;
  color: rgb(87, 110, 158);
  cursor: default;
}

.field-select .arrow {
  top: 0;
  font-family: Arial;
  user-select: none;
  transform: translateY(-10%);
}

.field-select .active {
  color: rgb(30, 85, 202);
}

.field-select .active ~ * {
  color: black;
}
</style>
