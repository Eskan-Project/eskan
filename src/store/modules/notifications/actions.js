import { rtdb } from "@/config/firebase";
import { ref, onValue, push, remove, set, update } from "firebase/database";

export default {
  async getNotifications({ commit, rootState }) {
    const userId = rootState.auth.userDetails?.uid;

    if (!userId) {
      return;
    }

    const notifRef = ref(rtdb, `notifications/${userId}`);

    onValue(
      notifRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log("Fetched Data:", data);

        if (data) {
          const notifications = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
          commit("setNotifications", notifications);
        } else {
          console.log("No notifications found");
          commit("setNotifications", []);
        }
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );
  },

  async addNotification({ rootState }, message) {
    const userId = rootState.auth.userDetails?.uid;
    console.log(userId);
    const newNotifRef = push(ref(rtdb, `notifications/${userId}`));
    console.log(newNotifRef);
    await set(newNotifRef, {
      id: newNotifRef.key,
      message,
      timestamp: Date.now(),
      read: false,
    });
    console.log("Notification added");
  },
  async removeNotification({ commit, rootState }, notificationId) {
    const userId = rootState.auth.userDetails?.uid;
    const notifRef = ref(rtdb, `notifications/${userId}/${notificationId}`);
    await remove(notifRef);
    commit("removeNotification", notificationId);
  },
  async markAsRead({ commit, rootState }, notificationId) {
    const userId = rootState.auth.userDetails?.uid;
    const notifiRef = ref(rtdb, `notifications/${userId}/${notificationId}`);
    await update(notifiRef, { read: true });
    commit("updateNotification", notificationId);
  },
};
