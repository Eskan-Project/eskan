export default {
  setNotifications(state, notifications) {
    state.notifications = notifications;
  },
  addNotification(state, notification) {
    state.notifications.unshift(notification);
  },
  removeNotification(state, notificationId) {
    state.notifications = state.notifications.filter(
      (notification) => notification.id !== notificationId
    );
  },
};
