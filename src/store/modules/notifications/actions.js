import { rtdb } from "@/config/firebase";
import { ref, onValue, push, remove, set } from "firebase/database";

export default {
  async getNotifications({ commit, rootState }) {
    const userId = rootState.auth.userDetails?.uid;
    console.log("User ID:", userId);

    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    const notifRef = ref(rtdb, `notifications/${userId}`);
    console.log("Notification Reference:", notifRef.toString());

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
          console.log("Processed Notifications:", notifications);
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
    const newNotifRef = push(ref(rtdb, `notifications/${userId}`));
    await set(newNotifRef, {
      id: newNotifRef.key,
      message,
      timestamp: Date.now(),
      read: false,
    });
  },
  async removeNotification({ commit, rootState }, notificationId) {
    const userId = rootState.auth.userDetails?.uid;
    const notifRef = ref(rtdb, `notifications/${userId}/${notificationId}`);
    await remove(notifRef);
    commit("removeNotification", notificationId);
  },
};
