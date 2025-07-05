<template>
  <div class="files-drag-and-drop">
    <div
      v-show="componentProps.isEditMode"
      class="drop-files-field"
      @drop.prevent="dropFile"
      @dragenter.prevent="setIntersectedState(true)"
      @dragover.prevent
      @dragleave="setIntersectedState(false)"
      :class="{ 'intersected-field': isFilesIntersected }"
    >
      <p class="large-font">Перетащите сюда файлы, которые хотите прикрепить</p>
    </div>
    <div class="files-list">
      <p class="files-heading medium-font">Прикреплённые файлы:</p>
      <div
        class="file-item small-font"
        v-for="{ name, type } in fileList"
        :key="name"
      >
        <p>- {{ name }}, {{ type }}</p>
        <p
          v-show="isEditMode"
          class="remove-cross"
          @click="removeFile(name)"
        >
          x
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TFileData } from '~/types';
import { ref, watch } from 'vue';
import { useNotificationsStore } from '~/stores/notifications';

const notificationsStore = useNotificationsStore();

const attachedFiles = defineModel<Map<string, File>>('attachedFiles', { required: true });
const fileList = defineModel<TFileData[]>('fileList', { required: true });
const componentProps = defineProps<{ isEditMode: boolean }>();

const isFilesDropped = ref(false);

const isFilesIntersected = ref(false);

const setIntersectedState = (value: boolean) => {
  isFilesIntersected.value = value;
};

const dropFile = (event: DragEvent) => {
  setIntersectedState(false);
  if (!event.dataTransfer) {
    notificationsStore.addNotification('No data');
    return;
  }

  const files = event.dataTransfer.files;

  [...files].forEach((file) => {
    if (!file.type) {
      notificationsStore.addNotification('Only files are allowed')
      return;
    }

    if (!isFilesDropped.value) {
      isFilesDropped.value = true;
    }
    attachedFiles.value.set(file.name, file);
  });
};

const removeFile = (fileName: string) => {
  attachedFiles.value.delete(fileName);
  isFilesDropped.value = true;
};

watch(
  () => isFilesDropped.value,
  () => {
    if (!isFilesDropped.value) return;

    fileList.value = [...attachedFiles.value.values()].map((value) => ({ name: value.name, type: value.type }));

    isFilesDropped.value = false;
  }
);
</script>

<style scoped>
.files-drag-and-drop {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.drop-files-field {
  height: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  background-color: #b6c6ec;
  border-radius: 10px;
  text-align: center;
  overflow: hidden;
}

.drop-files-field p {
  text-overflow: ellipsis;
  overflow: hidden;
  pointer-events: none;
}

.drop-files-field.intersected-field {
  background-color: #d7e0f5;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: default;
}

.files-heading {
  margin: 5px 0px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.file-item {
  display: flex;
  gap: 10px;
}

.file-item p {
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
}

.remove-cross {
  color: red;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
}
</style>
