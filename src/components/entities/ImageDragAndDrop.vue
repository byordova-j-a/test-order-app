<template>
  <div
    class="image-drag-and-drop"
    :class="{ 'view-mode-image': !componentProps.isEditMode }"
  >
    <img
      ref="order-image"
      class="order-image"
      alt="order"
      v-show="modelValue"
    />
    <div
      v-show="componentProps.isEditMode"
      class="drop-image-hint large-font"
    >
      <p>Перетащите сюда изображение</p>
    </div>
    <div
      v-show="componentProps.isEditMode"
      class="drop-image-field"
      :class="{
        'intersected-field': isImageFieldIntersected
      }"
      @drop.prevent="dropImage"
      @dragenter.prevent="setIntersectedState(true)"
      @dragover.prevent
      @dragleave="setIntersectedState(false)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, ref, watch } from 'vue';

const modelValue = defineModel<string | null>({ required: true });
const componentProps = defineProps<{ isEditMode: boolean }>();

const droppedImage = useTemplateRef('order-image');

const imageType = /image.*/;

const isImageFieldIntersected = ref(false);

const setIntersectedState = (value: boolean) => {
  isImageFieldIntersected.value = value;
};

const dropImage = (event: DragEvent) => {
  setIntersectedState(false);
  if (!event.dataTransfer) return;

  const file = event.dataTransfer.files[0];
  if (!file.type.match(imageType)) {
    return;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const { result } = reader;
      if (typeof result === 'string' && droppedImage.value) {
        modelValue.value = result;
        resolve(result);
      }
    };

    reader.onerror = (err) => {
      console.log(err);
      reject(err);
    };

    reader.readAsDataURL(file);
  });
};

watch(
  () => modelValue.value,
  () => {
    if (modelValue.value && droppedImage.value) {
      droppedImage.value.src = modelValue.value;
    }
  }
);
</script>

<style scoped>
.image-drag-and-drop {
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #b6c6ec;
}

.view-mode-image {
  transform-origin: left top;
  transition-duration: 0.5s;
}
.view-mode-image:hover {
  transform: scale(140%);
}

.order-image,
.drop-image-hint,
.drop-image-field {
  width: 100%;
  height: 100%;
}

.order-image {
  object-fit: contain;
}

.drop-image-hint {
  background-color: rgba(255, 255, 255, 0.391);
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.drop-image-hint p {
  text-overflow: ellipsis;
  overflow: hidden;
}

.drop-image-field {
  position: absolute;
  top: 0;
}

.drop-image-field.intersected-field {
  background-color: rgba(255, 255, 255, 0.511);
}
</style>
