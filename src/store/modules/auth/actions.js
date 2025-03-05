import { auth, db } from "@/config/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
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
  async loginWithGoogle({ commit }) {
    commit("setLoading", true);
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

      const userRef = collection(db, "users");
      await addDoc(userRef, { name, email, role, createdAt: new Date() });

      console.log("User successfully added to Firestore:", user.uid);

      commit("setUser", { uid: user.uid, email, role });
    } catch (error) {
      console.error("Firestore Write Error:", error);
      commit("setError", error.message);
      throw error;
    } finally {
      commit("setLoading", false);
    }
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
