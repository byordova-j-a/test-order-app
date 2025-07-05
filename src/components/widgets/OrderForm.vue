<template>
  <div class="order-form">
    <div class="drag-and-drop-fields">
      <ImageDragAndDrop
        :isEditMode="isEditMode"
        v-model="orderImage"
      />

      <FilesDragAndDrop
        :isEditMode="isEditMode"
        v-model:attachedFiles="attachedFiles"
        v-model:fileList="orderFileList"
      />
    </div>

    <div class="text-fields">
      <FormButton
        class="end-button"
        :text="topButtonText"
        @click="switchMode"
      />

      <FormField
        v-model="textFields.title"
        :isEditMode="isEditMode"
        :type="EFormFieldType.INPUT"
        label="Заголовок заказа"
      />

      <FormField
        v-model="textFields.description"
        :isEditMode="isEditMode"
        :type="EFormFieldType.TEXTAREA"
        label="Описание заказа"
      />

      <FormField
        v-model="textFields.producer"
        :isEditMode="isEditMode"
        :type="EFormFieldType.INPUT"
        label="Данные изготовителя"
      />

      <FormField
        v-model="textFields.organization"
        :isEditMode="isEditMode"
        :type="EFormFieldType.INPUT"
        label="Информация об организации"
      />

      <FormField
        v-model="textFields.status"
        :isEditMode="isEditMode"
        :type="EFormFieldType.SELECT"
        label="Статус заказа"
      />

      <FormButton
        v-show="isEditMode"
        class=""
        text="Сохранить"
        :disabled="isSaveButtonDisabled"
        @click="saveForm"
      />
      <div
        v-show="!isEditMode"
        class="support-buttons-block"
      >
        <FormButton text="Перейти в чат" />
        <FormButton text="Связаться с поддержкой" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EFormFieldType, type TFileData, EOrderStatus } from '~/types';
import { ref, reactive, onMounted, computed } from 'vue';
import { useOrderStore } from '~/stores/order';
import FormField from '~/components/ui/FormField.vue';
import FormButton from '~/components/ui/FormButton.vue';
import ImageDragAndDrop from '~/components/entities/ImageDragAndDrop.vue';
import FilesDragAndDrop from '~/components/entities/FilesDragAndDrop.vue';

const orderStore = useOrderStore();

const isEditMode = ref(false);

const orderFileList = ref<TFileData[]>([]);
const attachedFiles = new Map<string, File>();

const orderImage = ref<null | string>(null);

const textFields = reactive({
  title: '',
  description: '',
  producer: '',
  organization: '',
  status: EOrderStatus.DRAFT
});

const currentOrder = computed(() => orderStore.getCurrentOrder);

const topButtonText = computed(() => (isEditMode.value ? 'Отменить' : 'Редактировать'));

const isSaveButtonDisabled = computed(
  () =>
    !(
      textFields.title.trim() &&
      textFields.description.trim() &&
      textFields.producer.trim() &&
      textFields.description.trim() &&
      textFields.organization.trim()
    )
);

const setInitialFormValues = () => {
  const { image, title, description, producer, organization, status, attachedFiles: files } = currentOrder.value;

  orderImage.value = image;

  textFields.title = title;
  textFields.description = description;
  textFields.producer = producer;
  textFields.organization = organization;
  textFields.status = status;
  orderFileList.value = [...files].map((item) => item);

  attachedFiles.clear();

  files.forEach(({ name, type }) => {
    attachedFiles.set(name, new File([''], name, { type }));
  });
};

const saveForm = () => {
  const formData = new FormData();
  formData.append('title', textFields.title);
  formData.append('description', textFields.description);
  formData.append('producer', textFields.producer);
  formData.append('organization', textFields.organization);
  formData.append('status', textFields.status);

  if (orderImage.value) {
    formData.append('image', orderImage.value);
  }

  [...attachedFiles.values()].forEach((file) => {
    formData.append('attachedFiles', file);
  });

  orderStore.updateCurrentOrder(formData);
  isEditMode.value = false;
};

const switchMode = () => {
  if (!isEditMode.value) {
    isEditMode.value = true;
  } else {
    setInitialFormValues();
    isEditMode.value = false;
  }
};

onMounted(() => {
  orderStore.fetchCurrentOrder();
  setInitialFormValues();
});
</script>

<style scoped>
.order-form {
  min-height: 100vh;
  width: calc(100vw - 16px);
  display: flex;
  flex-direction: row;
  font-family: '18vag';
  font-weight: 500;
}

.drag-and-drop-fields {
  width: 40%;
  max-width: 600px;
  border-right: 2px solid #b6c6ec;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
}

.text-fields {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

.end-button {
  align-self: end;
}

.support-buttons-block {
  display: flex;
  align-self: end;
  gap: 20px;
}
</style>
