<template>
  <section class="py-16 md:py-20 lg:py-24 min-h-screen px-4 sm:px-6 lg:px-8 mt-3 sm:mt-0 bg-gray-50 dark:bg-[#111827]">
    <div class="mx-auto max-w-7xl">
      <transition name="fade" appear>
        <div v-if="!formSubmitted && !errorMessage" class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:bg-white dark:md:bg-[#1F2937] rounded-2xl shadow-md overflow-hidden">
  
          <div class="p-4 sm:p-6 md:p-8 lg:p-10 text-[#364365] dark:text-white">
            <h2 class="text-center font-manrope text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6">
              {{ $t("contact.send_message") }}
            </h2>
            <form @submit.prevent="submitForm" class="space-y-4 sm:space-y-6">
              <input type="text" v-model="formData.name" class="w-full h-11 sm:h-12 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 bg-transparent text-sm sm:text-base font-normal rounded-full border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] px-4 dark:bg-[#1F2937]" :placeholder="$t('contact.name')" />
              <input type="email" v-model="formData.email" class="w-full h-11 sm:h-12 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 bg-transparent text-sm sm:text-base font-normal rounded-full border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] px-4 dark:bg-[#1F2937]" :placeholder="$t('contact.email')" />
              <input type="tel" v-model="formData.phone" class="w-full h-11 sm:h-12 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 bg-transparent text-sm sm:text-base font-normal rounded-full border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] px-4 dark:bg-[#1F2937]" :placeholder="$t('contact.phone')" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" />
              <textarea v-model="formData.message" class="resize-none w-full h-20 sm:h-24 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 bg-transparent text-sm sm:text-base font-normal rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] px-4 py-3 dark:bg-[#1F2937]" :placeholder="$t('contact.message')"></textarea>
              <button type="submit" :disabled="isSubmitting" class="w-full h-11 sm:h-12 text-white text-sm sm:text-base font-semibold rounded-full bg-[#364365] hover:bg-white hover:text-[#364365] dark:hover:bg-[#3D8BFF] dark:hover:text-white hover:border-2 hover:border-[#364365] dark:hover:border-[#3D8BFF] transition-all duration-300 shadow-sm disabled:opacity-50">
                {{ isSubmitting ? $t("contact.sending") : $t("contact.send") }}
              </button>
            </form>
          </div>

          
          <div class="relative flex flex-col justify-between lg:order-first">
            <div class="relative bg-[#364365] shadow-lg rounded-2xl overflow-hidden h-full">
              <div id="map" class="w-full h-full rounded-lg z-0"></div>
            </div>
            <div class="absolute top-4 left-4 sm:top-6 sm:left-6"></div>
            <div class="p-4 sm:p-6 md:p-8 bg-white dark:bg-[#1F2937] md:bg-transparent md:dark:bg-transparent md:absolute md:bottom-0 md:w-full">
              <div class="bg-white dark:bg-[#1F2937] rounded-lg p-4 sm:p-6 shadow-md md:shadow-none" dir="ltr">
                <a href="tel:4706011911" class="flex items-center mb-4 sm:mb-6">
                  <i class="bi bi-telephone text-lg sm:text-xl text-gray-700 dark:text-[#3D8BFF]"></i>
                  <h5 class="text-black dark:text-white text-sm sm:text-base font-normal ml-4">470-601-1911</h5>
                </a>
                <a href="mailto:EskanTeam@gmail.com" class="flex items-center mb-4 sm:mb-6">
                  <i class="bi bi-envelope text-lg sm:text-xl text-gray-700 dark:text-[#3D8BFF]"></i>
                  <h5 class="text-black dark:text-white text-sm sm:text-base font-normal ml-4 break-all">EskanTeam@gmail.com</h5>
                </a>
                <a href="#" class="flex items-center">
                  <i class="bi bi-geo-alt text-lg sm:text-xl text-gray-700 dark:text-[#3D8BFF]"></i>
                  <h5 class="text-black dark:text-white text-sm sm:text-base font-normal ml-4">Cairo, Egypt</h5>
                </a>
              </div>
            </div>
          </div>

        </div>
      </transition>

      <div v-if="formSubmitted" class="modal-overlay">
        <div class="modal">
          <p class="text-gray-600">{{ $t("contact.success_message") }}</p>
        </div>
      </div>

      <div v-if="errorMessage" class="modal-overlay">
        <div class="modal">
          <p class="text-gray-600">{{$t("contact.error_message")}}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import emailjs from "@emailjs/browser";
import L from "leaflet";

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
  mounted() {
    this.initMap();
    window.addEventListener('resize', this.adjustMapSize);
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true;
      this.errorMessage = null;

      const templateParams = {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        message: this.formData.message,
      };

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID4,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID4,
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY4
        );

        this.formSubmitted = true;
        this.resetForm();
        setTimeout(() => this.$router.push("/"), 2000);
      } catch (error) {
        console.error("EmailJS Error:", error);
        this.errorMessage = this.$t("contact.error");
      } finally {
        this.isSubmitting = false;
      }
    },
    closeModal() {
      this.formSubmitted = false;
      this.errorMessage = null;
    },
    resetForm() {
      this.formData = { name: "", email: "", phone: "", message: "" };
    },
    initMap() {
      const map = L.map("map").setView([30.0444, 31.2357], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const location = this.$t("contact.location_message");

      const contactInfo = `
        <div style="font-size: 14px;">
          <p style="margin-bottom: 0.2rem;"><i class="bi bi-telephone"></i> ${location}</p>
        </div>
      `;

      L.marker([30.0444, 31.2357]).addTo(map)
        .bindPopup(contactInfo)
        .openPopup();
    },
    adjustMapSize() {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        mapElement.style.height = `${window.innerHeight * 0.4}px`;
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.24);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.modal button {
  background: #364365;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.modal button:hover {
  background: #3D8BFF;
}
@media (max-width: 1024px) {
  .lg\:order-first {
    order: 2; 
  }
}


#map {
  height: 350px;
}

@media (min-width: 640px) {
  #map {
    height: 400px;
  }
}

@media (min-width: 1024px) {
  #map {
    height: 500px;
  }
}
</style>
