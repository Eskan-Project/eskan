import { auth } from "@/config/firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const db = getFirestore();

export default {
  async login({ commit }, { email, password }) {
    commit("setLoading", true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "user";
      commit("setUser", { ...user, role });
    } catch (error) {
      commit("setError", error.message);
      throw error;
    }
    commit("setLoading", false);
  },
  async register({ commit }, { name, email, password, role }) {
    commit("setLoading", true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", user.uid), { name, email, role });
      commit("setUser", { ...user, role });
    } catch (error) {
      commit("setError", error.message);
      throw error;
    }
    commit("setLoading", false);
  },
  async logout({ commit }) {
    commit("setLoading", true);
    try {
      await signOut(auth);
      commit("logout");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    }
    commit("setLoading", false);
  },
  async checkAuth({ commit }) {
    commit("setLoading", true);
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const role = userDoc.exists() ? userDoc.data().role : "user";
            commit("setUser", { uid: user.uid, email: user.email, role });
          } catch (error) {
            console.error("Error fetching user data:", error);
            commit("setUser", null);
          }
        } else {
          commit("logout");
        }
        commit("setLoading", false);
        resolve();
      });
    });
  },
};
