<template>
  <div class="max-w-lg mx-auto my-auto p-6 bg-white rounded-lg shadow-lg">
    <p v-if="loading" class="text-center text-gray-600">Loading...</p>

    <template v-if="property">
      <div v-if="!isOwnerDetailsVisible" class="text-center">
        <div class="flex justify-center mb-3 p-3 rounded-full bg-white w-16 h-16 mx-auto">
          <svg class="w-10 h-10 text-[#124365] animate-bounce" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16.5V19a2 2 0 0 1-2 2c-8.28 0-15-6.72-15-15a2 2 0 0 1 2-2h2.5a1 1 0 0 1 1 1v3.18a1 1 0 0 1-.29.71L7.91 9.91A12.06 12.06 0 0 0 14.09 16.09l1.52-1.52a1 1 0 0 1 .71-.29H19a1 1 0 0 1 1Z" />
          </svg>
        </div>

        <p class="text-lg text-gray-700 mb-3">
          Welcome! Would you like to view the owner's details?
        </p>

        <button
          @click="handleViewOwner"
          class="bg-gradient-to-r mt-4 from-[#124365] to-[#364365] text-white py-2 px-6 rounded-lg hover:scale-105 transition-transform"
        >
          🔓 Click here to unlock information
        </button>
      </div>

      <div v-if="showPaymentPrompt" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
        <div class="flex items-center justify-center space-x-2">
          <svg class="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
          <p>
            You have already viewed a property. To unlock this one, please
            proceed with the payment.
          </p>
        </div>
        <button
          @click="redirectToPayment"
          class="mt-3 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
        >
          💳 Proceed to Payment
        </button>
      </div>

      <div v-else-if="property.propertyContact && isOwnerDetailsVisible" class="mt-4 text-gray-900">
        <h2 class="text-xl font-semibold text-center mb-3">Owner Details</h2>
        <div class="flex flex-col items-center space-y-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile Picture"
            class="w-24 h-24 rounded-full shadow-md border-2 border-gray-300"
          />
          <p>
            <span class="font-semibold">Name:</span>
            {{ property.propertyContact.name }}
          </p>
          <p>
            <span class="font-semibold">Phone:</span>
            {{ property.propertyContact.phone }}
          </p>
          <p>
            <span class="font-semibold">Email:</span>
            {{ property.propertyContact.email }}
          </p>
          <p v-if="property.propertyContact.phone2">
            <span class="font-semibold">Phone 2:</span>
            {{ property.propertyContact.phone2 }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  props: {
    property: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOwnerDetailsVisible: false,
      loading: false,
      showPaymentPrompt: false,
    };
  },
  mounted() {
    this.checkPayment();
    this.watchUserViews();
  },
  methods: {
    async handleViewOwner() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        this.showPaymentPrompt = true;
        return;
      }

    
      if (this.property.propertyContact && this.property.propertyContact.userId === user.uid) {
        this.isOwnerDetailsVisible = true;
        return;
      }

      const db = getFirestore();
      const userRef = doc(db, `users/${user.uid}`);
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().paidProperties) {
          if (!docSnap.data().paidProperties.includes(this.id)) {
            if (docSnap.data().freePropertyViewed) {
              this.showPaymentPrompt = true;
            } else {
              await setDoc(
                userRef,
                {
                  freePropertyViewed: true,
                  paidProperties: arrayUnion(this.id),
                },
                { merge: true }
              );
              this.isOwnerDetailsVisible = true;
            }
          } else {
            this.isOwnerDetailsVisible = true;
          }
        } else {
          if (docSnap.data() && docSnap.data().freePropertyViewed) {
            this.showPaymentPrompt = true;
          } else {
            await setDoc(
              userRef,
              {
                freePropertyViewed: true,
                paidProperties: arrayUnion(this.id),
              },
              { merge: true }
            );
            this.isOwnerDetailsVisible = true;
          }
        }
      } catch (error) {
        console.error("Error handling view count:", error);
      }
    },
    redirectToPayment() {
      window.location.href = `/payment?propertyId=${this.id}`;
    },
    watchUserViews() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const userRef = doc(db, `users/${user.uid}`);

      onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().paidProperties) {
          this.isOwnerDetailsVisible = docSnap.data().paidProperties.includes(
            this.id
          );
        } else {
          this.isOwnerDetailsVisible = false;
        }
      });
    },
    async checkPayment() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const userRef = doc(db, `users/${user.uid}`);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists() && docSnap.data().paidProperties) {
        this.isOwnerDetailsVisible = docSnap.data().paidProperties.includes(
          this.id
        );
      } else {
        this.isOwnerDetailsVisible = false;
      }
    },
  },
};
</script>