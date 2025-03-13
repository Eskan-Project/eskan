<template>
  <section class="md:py-27 pt-20">
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <transition name="fade-out" appear>
        <div
          v-if="!formSubmitted && !errorMessage"
          class="grid lg:grid-cols-2 grid-cols-1 md:bg-white bg-none rounded-2xl gap-5"
        >
          <div class="lg:mb-0 mb-10 order-last md:order-first md:ps-0 px-4">
            <div class="group w-full h-full">
              <div class="relative h-full">
                <img
                  src="../assets/images/contact/contact-1.jpg"
                  loading="lazy"
                  alt="Contact Us"
                  class="w-full h-full rounded-l-2xl object-cover md:block"
                />
                <h1
                  class="font-manrope text-white text-4xl font-bold leading-10 absolute top-11 left-11"
                >
                  Contact us
                </h1>
                <div class="absolute bottom-0 w-full lg:p-11 p-5">
                  <div class="bg-white rounded-lg p-6 block">
                    <a href="tel:4706011911" class="flex items-center mb-6">
                      <i class="bi bi-telephone text-xl text-gray-700"></i>
                      <h5 class="text-black text-base font-normal leading-6 ml-5">
                        470-601-1911
                      </h5>
                    </a>

                    <a
                      href="mailto:EskanTeam@gmail.com"
                      class="flex items-center mb-6"
                    >
                      <i class="bi bi-envelope text-xl text-gray-700"></i>
                      <h5 class="text-black text-base font-normal leading-6 ml-5">
                        EskanTeam@gmail.com
                      </h5>
                    </a>

                    <a href="#" class="flex items-center">
                      <i class="bi bi-geo-alt text-xl text-gray-700"></i>
                      <h5 class="text-black text-base font-normal leading-6 ml-5">
                        Cairo, Egypt
                      </h5>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-5 lg:p-11 lg:rounded-r-2xl text-[#364365]">
            <h2
              class="text-[#364365] font-manrope text-4xl font-semibold leading-10 mb-11 text-center md:text-left"
            >
              Send Us A Message
            </h2>
            <form @submit.prevent="submitForm">
              <input
                type="text"
                v-model="formData.name"
                class="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-4"
                placeholder="Name"
              />
              <input
                type="email"
                v-model="formData.email"
                class="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-4"
                placeholder="Email"
              />
              <input
                type="tel"
                v-model="formData.phone"
                class="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-4"
                placeholder="Phone"
              />
              <textarea
                v-model="formData.message"
                class="resize-none w-full h-24 text-gray-600 placeholder-gray-400 bg-transparent text-lg shadow-sm font-normal leading-7 rounded-xl border border-gray-200 focus:outline-none pl-4 mb-4"
                placeholder="Message"
              ></textarea>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-700 bg-[#364365] hover:bg-white hover:text-[#364365] hover:border-2 hover:border-[#364365] shadow-sm"
              >
                {{ isSubmitting ? "Sending..." : "Send" }}
              </button>
            </form>
          </div>
        </div>
      </transition>
      <transition name="fade-in" appear>
        <div v-if="formSubmitted" class="flex justify-center mt-6">
          <div class="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-center">
            <i class="bi bi-check-circle text-2xl mr-3"></i>
            <p class="text-lg font-semibold">
              ✅ Your message has been sent successfully! Redirecting...
            </p>
          </div>
        </div>
      </transition>
      <transition name="fade-in" appear>
        <div v-if="errorMessage" class="flex justify-center mt-6">
          <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center">
            <i class="bi bi-exclamation-circle text-2xl mr-3"></i>
            <p class="text-lg font-semibold">
              ❌ {{ errorMessage }}
            </p>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        phone: "",
        message: "",
      },
      isSubmitting: false,
      formSubmitted: false,
      errorMessage: null, 
    };
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true;
      this.errorMessage = null; 

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/send-email`,
          this.formData,
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          this.formSubmitted = true;
          this.resetForm();
          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Error:", error);
        this.errorMessage = "Failed to send message. Please try again later.";
        setTimeout(() => {
            this.$router.push("/");
          }, 2000);

      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = { name: "", email: "", phone: "", message: "" };
    },
  },
};
</script>

<style>
.fade-out-enter-active, .fade-out-leave-active {
  transition: opacity 0.5s ease;
}
.fade-out-enter, .fade-out-leave-to {
  opacity: 0;
}
.fade-in-enter-active, .fade-in-leave-active {
  transition: opacity 0.8s ease;
}
.fade-in-enter, .fade-in-leave-to {
  opacity: 0;
}
</style>
