import { auth, db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import router from "@/router";

const provider = new GoogleAuthProvider();

export default {
  async login({ commit }, { email, password }) {
    commit("setLoading", true, { root: true });
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "user";
      commit("setUser", { uid: user.uid, email: user.email, role });
      router.push("/");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false, { root: true });
    }
  },

  async loginWithGoogle({ commit }) {
    commit("setLoading", true, { root: true });
    try {
      const { user } = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          role: "user",
          createdAt: new Date(),
        });
      }

      commit("setUser", { uid: user.uid, email: user.email, role: "user" });
      router.push("/");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false, { root: true });
    }
  },

  async register({ commit }, { name, email, password, role }) {
    commit("setLoading", true, { root: true });
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        createdAt: new Date(),
      });

      commit("setUser", { uid: user.uid, email, role });
      router.push("/");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false, { root: true });
    }
  },

  async logout({ commit }) {
    commit("setLoading", true, { root: true });
    try {
      await signOut(auth);
      commit("logout");
      router.push("/login");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false, { root: true });
    }
  },

  async checkAuth({ commit }) {
    commit("setLoading", true, { root: true });
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
        commit("setLoading", false, { root: true });
        resolve();
      });
    });
  },
};
