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
  updateNotification(state, notificationId) {
    const notification = state.notifications.find(
      (notification) => notification.id === notificationId
    );
    if (notification) {
      notification.read = true;
    }
  },
};
