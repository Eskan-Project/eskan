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
  async fetchUserDetails({ commit }) {
    commit("setLoading", true, { root: true });
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        return;
      }

      const userRole = await fetchUserRole(currentUser.uid);
      if (!userRole?.collection) {
        return;
      }

      const userRef = doc(db, userRole.collection, currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error(`User document not found in ${userRole.collection}`);
        commit("setUser", {});
      } else {
        commit("setUser", userDoc.data() || {});
      }
    } catch (error) {
      commit("setError", error.message);
      console.error(error);
    } finally {
      commit("setLoading", false, { root: true });
    }
  },
  async updateProfile({ commit, state }) {
    commit("setLoading", { root: true });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        commit("setLoading", { root: false });
        return null;
      }

      const userRole = await fetchUserRole(currentUser.uid);
      const userRef = doc(db, userRole.collection, currentUser.uid);
      const updatedUserDetails = {
        ...state.userDetails,
        updatedAt: new Date(),
      };
      await setDoc(userRef, updatedUserDetails, { merge: true });
      commit("setUserDetails", updatedUserDetails);
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", { root: false });
    }
  },

  async login({ commit }, { email, password }) {
    commit("setLoading", true, { root: true });
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      await this.dispatch("auth/fetchUserDetails", user.uid);
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
        await this.dispatch("auth/fetchUserDetails", user.uid);
        router.push("/");
      }
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false, { root: true });
    }
  },

  async registerWithRole(
    { commit, state },
    { uid, name, email, role, idImage = null }
  ) {
    commit("setLoading", true, { root: true });
    try {
      const userDetails = { ...state.userDetails };
      userDetails.uid = uid;
      userDetails.name = name;
      userDetails.email = email;
      userDetails.role = role;
      userDetails.isActive = true;

      if (role === "owner") {
        userDetails.idImage = idImage || null;
      }

      await storeUserInCollection(uid, userDetails);
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false, { root: true });
    }
  },
  async register({ commit, state }, { name, email, password, role, idImage }) {
    commit("setLoading", true, { root: true });
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userDetails = { ...state.userDetails };

      userDetails.uid = user.uid;
      userDetails.name = name;
      userDetails.email = email;
      userDetails.role = role;
      userDetails.isActive = true;

      if (role === "owner") {
        userDetails.idImage = idImage || null;
      }

      await storeUserInCollection(user.uid, userDetails);

      await this.dispatch("auth/fetchUserDetails", user.uid);
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
            await this.dispatch("auth/fetchUserDetails", user.uid);
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
