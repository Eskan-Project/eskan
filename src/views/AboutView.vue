<template>
  <main
    class="min-h-screen bg-gray-50 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-16"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Who We Are Section -->
      <section class="max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
        <h1
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#364365] mb-4 sm:mb-6 lg:mb-8 text-center md:text-left"
        >
          Who We Are
        </h1>
        <p
          class="text-center sm:text-left text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto md:mx-0"
        >
          Eskan is a dedicated web platform designed to simplify the rental
          process. Whether you're a newcomer looking for an affordable place or
          a property owner wanting to list your available spaces, Eskan provides
          a seamless and user-friendly solution.
        </p>
      </section>

      <!-- Our Mission Section -->
      <section class="max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
        <h2
          class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#364365] mb-4 sm:mb-6 lg:mb-8 text-center md:text-left"
        >
          Our Mission
        </h2>
        <p
          class="text-center sm:text-left text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto md:mx-0"
        >
          We strive to make housing more accessible for expatriates moving
          across Egypt. Our platform connects individuals searching for shared
          accommodations with property owners, ensuring a smooth and secure
          housing experience.
        </p>
      </section>

      <!-- Our Values Section -->
      <section class="max-w-6xl mx-auto">
        <h2
          class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#364365] mb-8 sm:mb-12 lg:mb-16 text-center md:text-left"
        >
          Our Values
        </h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
        >
          <!-- Value Card 1 -->
          <div
            class="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <div class="flex items-center mb-3 sm:mb-4">
              <i
                class="bi bi-people-fill text-xl sm:text-2xl md:text-3xl text-[#364365] mr-3"
              ></i>
              <h3
                class="text-base sm:text-lg md:text-xl font-semibold text-[#364365]"
              >
                People First
              </h3>
            </div>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg">
              We're dedicated to helping our members thrive. From finding the
              perfect home to providing 24/7 support, we put people at the
              center of everything we do.
            </p>
          </div>

          <!-- Value Card 2 -->
          <div
            class="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <div class="flex items-center mb-3 sm:mb-4">
              <i
                class="bi bi-star-fill text-xl sm:text-2xl md:text-3xl text-[#364365] mr-3"
              ></i>
              <h3
                class="text-base sm:text-lg md:text-xl font-semibold text-[#364365]"
              >
                Best Quality
              </h3>
            </div>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg">
              We're passionate about providing excellent service and creating a
              high-quality experience for our community.
            </p>
          </div>

          <!-- Value Card 3 -->
          <div
            class="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <div class="flex items-center mb-3 sm:mb-4">
              <i
                class="bi bi-grid-fill text-xl sm:text-2xl md:text-3xl text-[#364365] mr-3"
              ></i>
              <h3
                class="text-base sm:text-lg md:text-xl font-semibold text-[#364365]"
              >
                Comprehensive
              </h3>
            </div>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg">
              Easily browse and filter housing options by location, price, and
              amenities.
            </p>
          </div>

          <!-- Value Card 4 -->
          <div
            class="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <div class="flex items-center mb-3 sm:mb-4">
              <i
                class="bi bi-shield-check text-xl sm:text-2xl md:text-3xl text-[#364365] mr-3"
              ></i>
              <h3
                class="text-base sm:text-lg md:text-xl font-semibold text-[#364365]"
              >
                Verified Owners
              </h3>
            </div>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg">
              We ensure safety by verifying owners through legal document
              submissions and online meetings.
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  name: "AboutView",
};
</script>

<style scoped>
/* Optional: Add subtle animation for section entrances */
section {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

section:nth-child(2) {
  animation-delay: 0.2s;
}

section:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
