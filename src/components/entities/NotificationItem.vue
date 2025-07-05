<template>
  <div
    class="notification-item"
    :class="{ showing: isNotificationShowing }"
  >
    <p class="large-font">{{ currentNotification?.message }}</p>
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '~/stores/notifications';
import { computed,ref,watch} from 'vue';

const notificationsStore = useNotificationsStore();
const currentNotification = computed(() => notificationsStore.getCurrentNotification);

const isNotificationShowing = ref(false);

watch(
  () => notificationsStore.getCurrentNotification,
  (currentNotification) => {
    if (!currentNotification) return;

    setTimeout(() => {
      isNotificationShowing.value = true;
    }, 0);

    setTimeout(() => {
      isNotificationShowing.value = false;
      setTimeout(() => {
        notificationsStore.removeCurrentNotification();
      }, 500);
    }, 2000);
  },
  { immediate: true }
);
</script>

<style scoped>
.notification-item {
  user-select: none;
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: rgb(138, 166, 227);
  transform: translateY(110%);
  transition-property: transform;
  transition-duration: 0.5s;
  font-family: '18vag';
  font-weight: normal;
  min-height: 40px;
  padding: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  max-width: 260px;
  word-break: break-all;
}

.notification-item p {
  text-align: center;
}

.showing {
  transform: translateY(0%);
}

</style>
