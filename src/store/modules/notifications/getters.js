export default {
  notifications: (state) => state.notifications,
  unreadCount: (state) =>
    state.notifications.filter((notif) => !notif.read).length,
};
