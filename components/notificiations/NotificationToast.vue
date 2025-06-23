<template>
  <div>
    <n-notification-provider>
      <!-- This component will be used as a wrapper around your app -->
    </n-notification-provider>
  </div>
</template>

<script setup lang="ts">
import { useNotificationProvider } from 'naive-ui';
import { watch } from 'vue';
import { useNotificationsStore } from '~/stores/notifications';

// Get access to notification API
const notification = useNotificationProvider();

// Get the notifications store
const notificationsStore = useNotificationsStore();

// Watch for new notifications
watch(
  () => [...notificationsStore.notifications],
  (newNotifications, oldNotifications) => {
    // If there's a new notification (array length increased)
    if (newNotifications.length > oldNotifications.length) {
      // Find the new notification (that doesn't exist in the old array)
      const newNotification = newNotifications.find(
        (newItem) =>
          !oldNotifications.some((oldItem) => oldItem.id === newItem.id)
      );

      if (newNotification && !newNotification.read) {
        // Map notification type to Naive UI notification type
        const typeMap = {
          info: 'info',
          success: 'success',
          warning: 'warning',
          error: 'error',
          message: 'default',
          task: 'default',
          default: 'default',
        };

        // Show toast notification
        notification[typeMap[newNotification.type] || 'default']({
          title: newNotification.title,
          content: newNotification.message,
          duration: 5000,
          closable: true,
          action: newNotification.actionLabel
            ? () =>
                h(
                  'n-button',
                  {
                    text: true,
                    type: 'primary',
                    onClick: () => {
                      if (newNotification.actionLink) {
                        navigateTo(newNotification.actionLink);
                      }
                      notificationsStore.markAsRead(newNotification.id);
                    },
                  },
                  { default: () => newNotification.actionLabel }
                )
            : undefined,
          onClose: () => {
            // Mark as read when notification is closed
            notificationsStore.markAsRead(newNotification.id);
          },
        });
      }
    }
  },
  { deep: true }
);
</script>
