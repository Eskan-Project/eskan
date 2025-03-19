// src/store/modules/auth.js
import { auth, db } from "@/config/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        commit("logout");
        return;
      }

      const userRole = await fetchUserRole(currentUser.uid);
      if (!userRole?.collection) return;

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
    }
  },
  async updateProfile({ commit, state }) {
    commit("startLoading", null, { root: true });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

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
      commit("stopLoading", null, { root: true });
    }
  },
  async login({ commit }, { email, password }) {
    commit("startLoading", null, { root: true });
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await this.dispatch("auth/fetchUserDetails", user.uid);
      router.push("/");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        commit("setError", "Invalid email or password");
      } else {
        commit("setError", "Login failed. Please try again");
      }
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
  async loginWithGoogle({ commit }, intendedRole) {
    commit("setError", null);
    commit("startLoading", null, { root: true });

    try {
      const { user } = await signInWithPopup(auth, provider);
      const existingRole = await fetchUserRole(user.uid);

      if (!existingRole && intendedRole === "owner") {
        const tempUserDetails = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          role: "owner",
          isActive: false,
          createdAt: new Date(),
        };

        return router.push({
          name: "SelectRole",
          query: {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            role: "owner",
          },
        });
      } else if (!existingRole && intendedRole === "user") {
        const userDetails = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          role: "user",
          isActive: true,
          freeViewsRemaining: 3,
          paidProperties: [],
          createdAt: new Date(),
        };
        await storeUserInCollection(user.uid, userDetails);
        commit("setUser", userDetails);
        router.push("/");
      } else if (!existingRole) {
        return router.push({
          name: "SelectRole",
          query: {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            role: "",
          },
        });
      } else {
        await this.dispatch("auth/fetchUserDetails", user.uid);
        router.push("/");
      }
    } catch (error) {
      let errorMessage = "Google login failed. Please try again.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login popup was closed. Please try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      }
      commit("setError", errorMessage);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
  async registerWithRole(
    { commit, state },
    { uid, name, email, role, idImage = null }
  ) {
    commit("startLoading", null, { root: true });
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
      commit("stopLoading", null, { root: true });
    }
  },
  async register({ commit, state }, { name, email, password, role, idImage }) {
    commit("startLoading");
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
      userDetails.paidProperties = [];
      userDetails.freeViewsRemaining = 3;

      if (role === "owner") {
        userDetails.idImage = idImage || null;
      }

      await storeUserInCollection(user.uid, userDetails);
      commit("setUser", userDetails);
      router.push("/");
      return {
        success: true,
        message: `Welcome ${name}! You have 3 free property views.`,
      };
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading");
    }
  },
  async resetPassword({ commit }, email) {
    commit("startLoading", null, { root: true });
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
      commit("stopLoading", null, { root: true });
    }
  },
  async logout({ commit }) {
    commit("startLoading", null, { root: true });
    try {
      await signOut(auth);
      await new Promise((resolve) => setTimeout(resolve, 500));
      commit("logout");
      router.push("/login");
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
  async checkAuth({ commit }) {
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
        resolve();
      });
    });
  },
  async updateFreeViews({ commit }, { uid, role }) {
    commit("startLoading", null, { root: true });
    try {
      const userRef = doc(db, role === "user" ? "users" : "owners", uid);
      const userDoc = await getDoc(userRef);
      const currentUser = userDoc.data();
      const newFreeViews = currentUser.freeViewsRemaining - 1;
      await updateDoc(userRef, {
        freeViewsRemaining: newFreeViews,
      });
      commit("setUser", {
        ...userDoc.data(),
        freeViewsRemaining: newFreeViews,
      });
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
  async addPaidProperty({ commit }, { uid, propertyId, role }) {
    commit("startLoading", null, { root: true });
    try {
      const userRef = doc(db, role === "user" ? "users" : "owners", uid);
      const userDoc = await getDoc(userRef);
      const currentData = userDoc.data();
      const updatedPaidProperties = [...currentData.paidProperties, propertyId];
      await updateDoc(userRef, { paidProperties: updatedPaidProperties });
      commit("setUser", {
        ...currentData,
        paidProperties: updatedPaidProperties,
      });
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
};
