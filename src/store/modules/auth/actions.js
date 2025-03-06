import { auth, db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import router from "@/router";
import {
  fetchUserRole,
  storeUserInCollection,
} from "@/services/firebaseService";

const provider = new GoogleAuthProvider();

export default {
  async login({ commit }, { email, password }) {
    commit("setLoading", true, { root: true });
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userRole = await fetchUserRole(user.uid);

      commit("setUser", { uid: user.uid, email: user.email, role: userRole });
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
      const userRole = await fetchUserRole(user.uid);

      if (!userRole) {
        router.push({
          name: "SelectRole",
          query: { uid: user.uid, email: user.email, name: user.displayName },
        });
      } else {
        commit("setUser", { uid: user.uid, email: user.email, role: userRole });
        router.push("/");
      }
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false, { root: true });
    }
  },

  async register({ commit }, { name, email, password, role, idImage }) {
    commit("setLoading", true, { root: true });
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await storeUserInCollection(user.uid, name, email, role, idImage);

      commit("setUser", { uid: user.uid, email, role });
      router.push("/");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false, { root: true });
    }
  },
  async resetPassword({ commit }, email) {
    commit("setLoading", true, { root: true });
    try {
      await sendPasswordResetEmail(auth, email);
      commit("setError", null);
      return {
        success: true,
        message: "Password reset link sent to your email.",
      };
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
