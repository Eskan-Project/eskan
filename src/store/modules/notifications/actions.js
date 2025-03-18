import { rtdb } from "@/config/firebase";
import { ref, onValue, push, remove, set, update } from "firebase/database";

export default {
  async addNotification({ rootState }, message) {
    console.log("Adding notification:", message);
    const userId = rootState.auth.userDetails?.uid;
    const ownerId = message.ownerId || userId; 
    if (!ownerId) {
      console.error("Owner ID is missing, cannot add notification.");
      return;
    }
    const ownerNotifRef = push(ref(rtdb, `notifications/${ownerId}`));
    await set(ownerNotifRef, {
      id: ownerNotifRef.key,
      message: message.message || message, 
      timestamp: Date.now(),
      read: false,
      type: message.type || "createProperty", 
      senderId: userId, 
    });
    console.log(`Notification added for owner ID: ${ownerId}`);
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
};
