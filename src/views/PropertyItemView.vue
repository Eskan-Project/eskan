<template>
  <div
    v-if="property && !loadingCount"
    class="container mx-auto py-5 sm:py-10 px-3 sm:px-5 mt-15 sm:mt-5"
  >
    <!-- Back Button -->
    <div class="mb-5 sm:mt-0">
      <router-link
        to="/properties"
        class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
      >
        <i class="bi bi-arrow-left"></i>
        <span>{{ $t("propertyItemView.back_to_properties") }}</span>
      </router-link>
    </div>

    <!-- Property Header Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
      <!-- Left Column (Images & Details) -->
      <div class="bg-white rounded-lg p-4 sm:p-6 shadow-lg col-span-3">
        <div
          class="flex flex-col sm:flex-row justify-between items-start gap-4"
        >
          <div class="space-y-2 w-full sm:w-auto">
            <h1
              class="text-2xl sm:text-3xl font-bold text-gray-900 capitalize break-words"
            >
              {{ property.title || $t("propertyItemView.untitled_property") }}
            </h1>
            <p
              class="text-base sm:text-lg text-gray-600 flex items-center capitalize break-words"
            >
              <i class="bi bi-geo-alt mr-2 text-blue-500 flex-shrink-0"></i>
              <span>{{ locationText }}</span>
            </p>
          </div>
          <div
            class="flex flex-col items-start sm:items-end justify-between gap-2 sm:gap-4 w-full sm:w-auto"
          >
            <p class="text-xl sm:text-2xl font-bold text-blue-700">
              {{ formattedPrice(property.price) }}
              {{ $t("propertyCard.currency") }}
            </p>
            <div class="flex items-center text-sm text-gray-500 gap-3">
              <p>
                <i class="bi bi-calendar3 mr-1"></i>
                {{ formatDate(property.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-3 md:col-span-2 space-y-5 sm:space-y-8">
        <!-- Main Image Gallery -->
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
          <div
            class="relative w-full h-60 xs:h-72 sm:h-96 rounded-lg overflow-hidden group"
          >
            <div
              v-if="!imageLoaded"
              class="absolute inset-0 flex items-center justify-center bg-gray-100"
            >
              <div class="animate-pulse flex space-x-2">
                <div class="h-2 w-2 bg-blue-400 rounded-full"></div>
                <div class="h-2 w-2 bg-blue-400 rounded-full"></div>
                <div class="h-2 w-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            <img
              :src="currentImage"
              alt="Property Image"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @load="imageLoaded = true"
              :class="{
                'opacity-0': !imageLoaded,
                'opacity-100 transition-opacity duration-300': imageLoaded,
              }"
            />
            <button
              @click="prevImage"
              class="cursor-pointer absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white text-gray-700 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-95 transition opacity-60 sm:opacity-0 group-hover:opacity-100"
              aria-label="Previous Image"
            >
              <i class="bi bi-chevron-left text-base sm:text-xl"></i>
            </button>
            <button
              @click="nextImage"
              class="cursor-pointer absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white text-gray-700 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-95 transition opacity-60 sm:opacity-0 group-hover:opacity-100"
              aria-label="Next Image"
            >
              <i class="bi bi-chevron-right text-base sm:text-xl"></i>
            </button>
            <button
              @click="toggleFullScreen"
              class="cursor-pointer absolute bottom-4 right-4 bg-white text-gray-700 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition opacity-60 sm:opacity-0 group-hover:opacity-100"
              aria-label="View Fullscreen"
            >
              <i class="bi bi-arrows-fullscreen text-base sm:text-lg"></i>
            </button>
            <div
              class="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
            >
              {{ currentImageIndex + 1 }} / {{ property.images.length }}
            </div>
          </div>

          <!-- Thumbnails -->
          <div class="relative mt-3 sm:mt-4">
            <div
              ref="thumbnailContainer"
              class="flex overflow-x-auto gap-2 sm:gap-3 py-2 scroll-smooth thumbnail-gallery px-2"
            >
              <img
                v-for="(img, index) in property.images"
                :key="index"
                :src="img"
                loading="lazy"
                class="h-16 w-16 xs:h-18 xs:w-18 sm:h-24 sm:w-32 object-cover rounded-lg cursor-pointer transition-all duration-200 hover:opacity-100 flex-shrink-0 hover:shadow-lg"
                :class="{
                  'ring-2 ring-blue-500 shadow-md opacity-100 scale-105':
                    currentImageIndex === index,
                  'opacity-70 hover:opacity-90': currentImageIndex !== index,
                }"
                @click="
                  currentImageIndex = index;
                  scrollToActiveThumbnail();
                "
                :alt="`Thumbnail ${index + 1}`"
              />
            </div>
            <button
              v-if="property.images.length > visibleThumbnails"
              @click="scrollThumbnails(-1)"
              class="cursor-pointer absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-gray-700 w-6 h-6 sm:w-8 sm:h-8 hidden md:flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
              aria-label="Scroll Left"
            >
              <i class="bi bi-chevron-left text-xs sm:text-base"></i>
            </button>
            <button
              v-if="property.images.length > visibleThumbnails"
              @click="scrollThumbnails(1)"
              class="cursor-pointer absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-gray-700 w-6 h-6 sm:w-8 sm:h-8 hidden md:flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
              aria-label="Scroll Right"
            >
              <i class="bi bi-chevron-right text-xs sm:text-base"></i>
            </button>
          </div>
        </div>

        <!-- Property Description (if available) -->
        <div
          v-if="property.description"
          class="bg-white rounded-lg p-4 sm:p-6 shadow-lg"
        >
          <h2
            class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4"
          >
            {{ $t("propertyItemView.description") }}
          </h2>
          <p class="text-gray-700 leading-relaxed text-sm sm:text-base">
            {{ property.description }}
          </p>
          <div v-if="longDescription" class="mt-4 flex justify-center">
            <button
              @click="showFullDescription = !showFullDescription"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium transition flex items-center gap-1"
            >
              <span>{{
                showFullDescription
                  ? $t("propertyItemView.show_less")
                  : $t("propertyItemView.read_more")
              }}</span>
              <i
                class="bi"
                :class="
                  showFullDescription ? 'bi-chevron-up' : 'bi-chevron-down'
                "
              ></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column (Contact & Details) -->
      <div class="col-span-3 md:col-span-1 space-y-5 sm:space-y-8">
        <!-- Contact Card -->
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
          <PropertyDetails :property="property" :id="property?.id" />
        </div>
        <div class="bg-white rounded-lg max-w-md w-full p-4 shadow-lg">
          <h3 class="text-xl font-semibold mb-4 text-gray-900">
            {{ $t("propertyItemView.share_property") }}
          </h3>
          <div class="grid grid-cols-3 gap-4 mb-2">
            <button
              @click="shareVia('facebook')"
              class="cursor-pointer flex flex-col items-center text-blue-600 hover:opacity-80 transition"
            >
              <div
                class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2"
              >
                <i class="bi bi-facebook text-xl"></i>
              </div>
              <span class="text-xs">{{ $t("propertyItemView.facebook") }}</span>
            </button>
            <button
              @click="shareVia('twitter')"
              class="cursor-pointer flex flex-col items-center text-sky-500 hover:opacity-80 transition"
            >
              <div
                class="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mb-2"
              >
                <i class="bi bi-twitter text-xl"></i>
              </div>
              <span class="text-xs">{{ $t("propertyItemView.twitter") }}</span>
            </button>
            <button
              @click="shareVia('whatsapp')"
              class="cursor-pointer flex flex-col items-center text-green-600 hover:opacity-80 transition"
            >
              <div
                class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2"
              >
                <i class="bi bi-whatsapp text-xl"></i>
              </div>
              <span class="text-xs">{{ $t("propertyItemView.whatsapp") }}</span>
            </button>
          </div>
          <div class="relative">
            <input
              type="text"
              readonly
              :value="
                shareUrl.length > 35
                  ? shareUrl.substring(0, 35) + '...'
                  : shareUrl
              "
              :class="[
                $i18n.locale === 'ar' ? 'ml-10 text-right' : 'mr-10 text-left',
                'w-full p-3 border border-gray-300 rounded-lg text-sm ',
              ]"
              dir="ltr"
              ref="shareUrlInput"
              @click="copyShareUrl"
            />
            <button
              @click="copyShareUrl"
              :class="[
                $i18n.locale === 'ar' ? 'left-0' : 'right-0',
                'cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 absolute top-1/2 transform -translate-y-1/2 hover:text-gray-300',
              ]"
            >
              <i
                class="bi"
                :class="copied ? 'bi-check-lg text-green-600' : 'bi-clipboard'"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Information Section -->
    <div class="mt-5 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
      <!-- General Information -->
      <div class="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
        <h2
          class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center"
        >
          <i
            :class="[
              $i18n.locale === 'ar'
                ? 'bi bi-info-circle ml-2 text-blue-500'
                : 'bi bi-info-circle mr-2 text-blue-500',
            ]"
          ></i>
          {{ $t("propertyItemView.property_info") }}
        </h2>
        <div
          class="grid grid-cols-2 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base"
        >
          <div class="space-y-3 sm:space-y-4">
            <p>
              <strong>{{ $t("propertyItemView.floor_location") }}:</strong>
            </p>
            <p>
              <strong>{{ $t("propertyItemView.furnished") }}:</strong>
            </p>
            <p>
              <strong>{{ $t("propertyItemView.property_status") }}:</strong>
            </p>
            <p>
              <strong>{{ $t("propertyItemView.rooms") }}:</strong>
            </p>
            <p>
              <strong>{{ $t("propertyItemView.living_rooms") }}:</strong>
            </p>
            <p>
              <strong>{{ $t("propertyItemView.bathrooms") }}:</strong>
            </p>
            <p>
              <strong>{{ $t("propertyItemView.kitchens") }}:</strong>
            </p>
            <p>
              <strong>{{ $t("propertyItemView.area") }}:</strong>
            </p>
          </div>
          <div class="space-y-3 sm:space-y-4 font-semibold">
            <p>{{ property.floor }}</p>
            <p>
              {{
                property.furnished
                  ? $t("propertyItemView.yes")
                  : $t("propertyItemView.no")
              }}
            </p>
            <p class="capitalize">
              {{
                $t(
                  `propertyItemView.property_status_${property.propertyStatus}`
                )
              }}
            </p>
            <p>{{ formattedPrice(property.rooms) }}</p>
            <p>{{ formattedPrice(property.livingRooms) }}</p>
            <p>{{ formattedPrice(property.bathrooms) }}</p>
            <p>{{ formattedPrice(property.kitchens) }}</p>
            <p>
              {{ formattedPrice(property.area) }} {{ $t("propertyCard.area") }}
            </p>
          </div>
        </div>
      </div>

      <!-- Location Map -->
      <div class="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
        <h2
          class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center"
        >
          <i
            :class="[
              $i18n.locale === 'ar'
                ? 'bi bi-geo-alt ml-2 text-blue-500'
                : 'bi bi-geo-alt mr-2 text-blue-500',
            ]"
          ></i>
          {{ $t("propertyItemView.location_info") }}
        </h2>
        <div id="map" class="w-full h-48 sm:h-64 rounded-lg"></div>
        <p
          v-if="mapLoading"
          class="mt-3 text-gray-700 text-center text-sm sm:text-base"
        >
          {{ $t("propertyItemView.loading_map") }}
        </p>
        <div class="mt-3 flex justify-end">
          <a
            :href="getGoogleMapsLink()"
            target="_blank"
            class="text-sm text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
          >
            <span>{{ $t("propertyItemView.view_on_google_maps") }}</span>
            <i
              :class="[
                $i18n.locale === 'ar'
                  ? 'bi bi-box-arrow-up-left'
                  : 'bi bi-box-arrow-up-right',
              ]"
            ></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Viewer -->
    <transition name="fade">
      <div
        v-if="isFullScreen"
        class="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
      >
        <div class="relative w-full max-w-5xl px-3 sm:px-0">
          <img
            :src="currentImage"
            class="w-full h-auto max-h-screen object-contain"
            alt="Full-screen Property Image"
          />
          <button
            @click="prevImage"
            class="cursor-pointer absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white text-gray-700 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
          >
            <i class="bi bi-chevron-left text-base sm:text-xl"></i>
          </button>
          <button
            @click="nextImage"
            class="cursor-pointer absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white text-gray-700 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
          >
            <i class="bi bi-chevron-right text-base sm:text-xl"></i>
          </button>
          <button
            @click="toggleFullScreen"
            class="cursor-pointer absolute top-2 sm:top-4 right-2 sm:right-4 bg-white text-gray-700 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
          >
            <i class="bi bi-x-lg text-base sm:text-lg"></i>
          </button>
          <div
            class="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm"
          >
            {{ currentImageIndex + 1 }} / {{ property.images.length }}
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div
    v-if="!property && loadingCount === 0"
    class="min-h-screen flex items-center justify-center p-4"
  >
    <div
      class="text-center p-6 sm:p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto"
    >
      <i class="bi bi-house-x text-4xl sm:text-5xl text-gray-400 mb-4"></i>
      <div class="text-gray-600 text-lg sm:text-xl font-medium mb-2">
        {{ $t("propertyItemView.property_not_found") }}
      </div>
      <p class="text-gray-500 mb-4 text-sm sm:text-base">
        {{ $t("propertyItemView.not_found_message") }}
      </p>
      <router-link
        to="/"
        class="inline-block bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
      >
        {{ $t("propertyItemView.back_to_home") }}
      </router-link>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PropertyDetails from "../components/PropertyDetails.vue";
import { mapActions, mapState } from "vuex";
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import Swal from "sweetalert2";

export default {
  name: "PropertyDetail",
  props: ["title"],
  components: { PropertyDetails },
  data() {
    return {
      currentImageIndex: 0,
      galleryStartIndex: 0,
      mapInstance: null,
      mapLoading: false,
      visibleThumbnails: 4,
      isFullScreen: false,
      windowWidth: window.innerWidth,
      imageLoaded: false,
      showFullDescription: false,
      longDescription: false,
      isWishlisted: false,
      shareUrl: "",
      copied: false,
      similarProperties: [],
    };
  },
  computed: {
    ...mapState("property", ["property"]),
    ...mapState("auth", ["userDetails"]),
    ...mapState(["loadingCount"]),
    isAdmin() {
      return this.userDetails && this.userDetails.role === "admin";
    },
    currentImage() {
      return (
        this.property?.images?.[this.currentImageIndex] ||
        "path/to/placeholder.jpg"
      );
    },
    visibleGallery() {
      return (
        this.property?.images?.slice(
          this.galleryStartIndex,
          this.galleryStartIndex + this.visibleThumbnails
        ) || []
      );
    },
    governorateName() {
      const governorate = governorates.find(
        (g) => g.id === this.property.governorate
      );
      return this.$i18n.locale === "ar"
        ? governorate?.governorate_name_ar || this.$t("propertyCard.unknown")
        : governorate?.governorate_name_en || this.$t("propertyCard.unknown");
    },
    cityName() {
      const city = cities.find((c) => c.id === this.property.city);
      return this.$i18n.locale === "ar"
        ? city?.city_name_ar || this.$t("propertyCard.unknown")
        : city?.city_name_en || this.$t("propertyCard.unknown");
    },
    locationText() {
      return `${this.governorateName} - ${this.cityName}${
        this.property.neighborhood ? ` - ${this.property.neighborhood}` : ""
      }`;
    },
    isMobile() {
      return this.windowWidth < 640;
    },
    isTablet() {
      return this.windowWidth >= 640 && this.windowWidth < 768;
    },
    propertyCoordinates() {
      if (this.property?.coordinates) {
        return {
          lat: this.property.coordinates.latitude,
          lng: this.property.coordinates.longitude,
        };
      }
      return null;
    },
  },
  watch: {
    property: {
      immediate: true,
      handler(newValue) {
        if (newValue?.description) {
          this.longDescription = newValue.description.length > 300;

          if (this.longDescription && !this.showFullDescription) {
            // Truncate the description for initial display
            this.truncatedDescription =
              newValue.description.substring(0, 300) + "...";
          }
        }
      },
    },
  },
  mounted() {
    this.getProperty(this.title).then(() => {
      console.log("Fetched property by title:", this.property);
      this.$nextTick(() => {
        this.initMapWithFallback();
        this.scrollToActiveThumbnail();
      });
      this.updateGalleryStartIndex();
      this.fetchSimilarProperties();

      // Generate share URL
      this.shareUrl = window.location.href;

      console.log("userDetails", this.userDetails);
    });

    this.updateVisibleThumbnails();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions("property", ["getProperty"]),

    // Share functionality
    shareProperty() {
      if (navigator.share) {
        // Native share API (mobile devices)
        navigator
          .share({
            title: this.property.title,
            text: `Check out this property: ${this.property.title}`,
            url: window.location.href,
          })
          .catch((error) => console.log("Error sharing", error));
      } else {
        // Show share modal for desktops
        this.showShareModal = true;
      }
    },

    shareVia(platform) {
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(this.property.title);
      let shareUrl = "";

      switch (platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${title}%20${url}`;
          break;
      }

      window.open(shareUrl, "_blank", "width=600,height=400");
      this.showShareModal = false;
    },

    copyShareUrl() {
      const el = this.$refs.shareUrlInput;
      el.select();
      document.execCommand("copy");

      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);

      toast.success(this.$t("propertyItemView.copy_link"), {
        autoClose: 2000,
        position: toast.POSITION.TOP_RIGHT,
      });
    },

    // Google Maps link
    getGoogleMapsLink() {
      if (this.propertyCoordinates) {
        return `https://www.google.com/maps/search/?api=1&query=${this.propertyCoordinates.lat},${this.propertyCoordinates.lng}`;
      } else {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          this.locationText
        )}`;
      }
    },

    // Similar properties
    fetchSimilarProperties() {
      // This would be replaced with actual data fetching
      this.similarProperties = [];
    },

    handleResize() {
      this.windowWidth = window.innerWidth;
      this.updateVisibleThumbnails();
      this.scrollToActiveThumbnail();

      // Invalidate map size on resize to prevent display issues
      if (this.mapInstance) {
        this.mapInstance.invalidateSize();
      }
    },
    updateVisibleThumbnails() {
      if (this.windowWidth < 640) {
        this.visibleThumbnails = 2;
      } else if (this.windowWidth < 768) {
        this.visibleThumbnails = 3;
      } else {
        this.visibleThumbnails = 4;
      }
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;

      // Prevent scrolling when fullscreen is active
      if (this.isFullScreen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
    nextImage() {
      if (!this.property?.images?.length) return;
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.property.images.length;
      this.updateGalleryStartIndex();
      this.scrollToActiveThumbnail();
      this.imageLoaded = false; // Reset image loaded state for loading indicator
    },
    prevImage() {
      if (!this.property?.images?.length) return;
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.property.images.length) %
        this.property.images.length;
      this.updateGalleryStartIndex();
      this.scrollToActiveThumbnail();
      this.imageLoaded = false; // Reset image loaded state for loading indicator
    },
    scrollThumbnails(direction) {
      const container = this.$refs.thumbnailContainer;
      if (!container) return;

      // Adjust scroll distance based on screen size
      const thumbnailWidth =
        container.querySelector("img").offsetWidth +
        (this.isMobile ? 8 : this.isTablet ? 12 : 16);

      container.scrollBy({
        left: direction * thumbnailWidth * (this.isMobile ? 2 : 3),
        behavior: "smooth",
      });
    },
    scrollToActiveThumbnail() {
      const container = this.$refs.thumbnailContainer;
      if (!container) return;

      // Adjust scroll position based on screen size
      const thumbnailWidth =
        container.querySelector("img").offsetWidth +
        (this.isMobile ? 8 : this.isTablet ? 12 : 16);

      const scrollPosition =
        this.currentImageIndex * thumbnailWidth -
        (container.offsetWidth - thumbnailWidth) / 2;

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    },
    updateGalleryStartIndex() {
      if (!this.property?.images?.length) return;
      this.galleryStartIndex =
        Math.floor(this.currentImageIndex / this.visibleThumbnails) *
        this.visibleThumbnails;
    },
    async initMapWithFallback() {
      this.mapLoading = true;
      let lat, lng;

      // Step 1: Try property coordinates
      if (
        this.property?.coordinates &&
        this.property.coordinates.latitude &&
        this.property.coordinates.longitude
      ) {
        ({ latitude: lat, longitude: lng } = this.property.coordinates);
      } else {
        try {
          const coords = await this.geocodeLocation(this.locationText);
          if (coords && coords.lat && coords.lon) {
            lat = coords.lat;
            lng = coords.lon;
          } else {
            console.warn("Geocoding returned no valid coordinates:", coords);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      }

      // Step 3: Default coordinates if still undefined
      if (lat === undefined || lng === undefined) {
        console.warn(
          "No valid coordinates found, using default location (Cairo, Egypt)."
        );
        lat = 30.0444; // Default to Cairo, Egypt
        lng = 31.2357;
      }

      // Step 4: Initialize map with validated coordinates
      try {
        this.mapInstance = L.map("map", { scrollWheelZoom: false }).setView(
          [lat, lng],
          this.property?.coordinates ? 13 : 10 // Zoom level based on source
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(this.mapInstance);

        const marker = L.marker([lat, lng], { icon: this.getCustomIcon("red") })
          .addTo(this.mapInstance)
          .bindPopup(
            `<b>${this.property?.title || "Unknown Property"}</b><br>${
              this.locationText
            }`
          );

        // Add pulse animation to the marker
        if (marker._icon) {
          marker._icon.classList.add("map-marker-pulse");
        }

        marker.openPopup();
      } catch (error) {
        console.error("Map initialization error:", error);
      } finally {
        this.mapLoading = false;
      }
    },
    async geocodeLocation(locationText) {
      console.log(locationText);
      const locationParts = locationText.split("-");
      const filteredLocation = locationParts.slice(0, 2).join(" ");
      const query = encodeURIComponent(filteredLocation);
      console.log(query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
      );
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    },
    getCustomIcon(color) {
      return L.icon({
        iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    },
    formatDate(timestamp) {
      let date;
      if (typeof timestamp === "number") {
        // Handle seconds (e.g., 1741559808)
        date = new Date(timestamp * 1000); // Convert seconds to milliseconds
      } else if (
        timestamp.seconds !== undefined &&
        timestamp.nanoseconds !== undefined
      ) {
        // Handle Firestore Timestamp object (e.g., { seconds: 1741559808, nanoseconds: 450000000 })
        date = new Date(
          timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000)
        );
      } else if (timestamp instanceof Date) {
        // Already a Date object
        date = timestamp;
      } else if (typeof timestamp === "string") {
        // ISO string or other string format
        date = new Date(timestamp);
      } else {
        return "Invalid Date";
      }

      return date.toLocaleDateString(
        this.$i18n.locale === "ar" ? "ar-EG" : "en-US",
        {
          dateStyle: "short",
        }
      );
    },
    formattedPrice(price) {
      if (typeof price !== "number" && isNaN(Number(price))) {
        return price; // Return as-is if price isn't a valid number
      }
      const locale = this.$i18n.locale === "ar" ? "ar-EG" : "en-US";
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0, // No decimals unless needed
        maximumFractionDigits: 2, // Up to 2 decimals if present
      }).format(price);
    },
    viewContractImage() {
      if (!this.property.propertyContact?.contract) return;

      Swal.fire({
        imageUrl: this.property.propertyContact.contract,
        imageAlt: "Contract Document",
        width: "auto",
        padding: "1em",
        showConfirmButton: false,
        showCloseButton: true,
        background: "#fff",
        customClass: {
          image: "max-h-screen max-w-full object-contain",
        },
      });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

#map {
  z-index: 0 !important;
  position: relative;
  height: 300px;
  border-radius: 10px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  transition: height 0.3s ease;
}

@media (max-width: 640px) {
  #map {
    height: 200px;
  }

  .container {
    padding-top: 1rem;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #edf2f7;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Thumbnail Gallery */
.thumbnail-gallery {
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scrollbar-width: thin; /* Firefox */
  scroll-behavior: smooth;
  padding-bottom: 4px;
}

.thumbnail-gallery img {
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.thumbnail-gallery img:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Make controls always visible on touch devices */
@media (max-width: 640px) {
  .group:hover button.opacity-60 {
    opacity: 0.8 !important;
  }

  /* Ensure touch targets are large enough */
  button {
    min-width: 36px;
    min-height: 36px;
  }
}

/* Animations and Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Fix map rendering issues on mobile */
.leaflet-container {
  z-index: 0;
}

/* Add a simple loading animation for images */
img[loading] {
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Map marker pulse animation */
.map-marker-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Card hover effects */
.bg-white {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bg-white:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Feature icons */
.w-10.h-10 {
  transition: all 0.3s ease;
}

.w-10.h-10:hover {
  transform: scale(1.1);
  background-color: rgba(59, 130, 246, 0.2);
}

/* Wishlist heart animation */
.bi-heart-fill {
  animation: heartBeat 0.5s ease-in-out;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}

/* Button styles */
button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.97);
}

/* Share modal animations */
.fixed.inset-0 {
  backdrop-filter: blur(2px);
}

/* Loading indicator pulse */
.animate-pulse {
  animation: pulse-loading 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-loading {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
