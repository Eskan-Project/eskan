<template>
  <main class="min-h-screen bg-gray-50 pt-[120px] pb-8">
    <div class="container mx-auto px-4">
      <!-- Who We Are Section -->
      <section class="max-w-6xl mx-auto mb-16">
        <h1 class="text-3xl md:text-4xl font-bold text-[#364365] mb-6">
          Who We Are
        </h1>
        <p class="text-gray-700 text-lg leading-relaxed">
          Eskan is a dedicated web platform designed to simplify the rental
          process. Whether you're a newcomer looking for an affordable place or
          a property owner wanting to list your available spaces, Eskan provides
          a seamless and user-friendly solution.
        </p>
      </section>

      <!-- Our Mission Section -->
      <section class="max-w-6xl mx-auto mb-16">
        <h2 class="text-2xl md:text-3xl font-bold text-[#364365] mb-6">
          Our mission
        </h2>
        <p class="text-gray-700 text-lg leading-relaxed">
          We strive to make housing more accessible for expatriates moving
          across Egypt. Our platform connects individuals searching for shared
          accommodations with property owners, ensuring a smooth and secure
          housing experience.
        </p>
      </section>

      <!-- Our Values Section -->
      <section class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-[#364365] mb-12">
          Our values
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Value Card 1 -->
          <div
            class="bg-white p-6 rounded-lg shadow-sm hover:transition-all duration-300 hover:scale-105"
          >
            <div class="flex items-center mb-4">
              <i class="bi bi-people-fill text-2xl text-[#364365] mr-2"></i>
              <h3 class="text-xl font-semibold text-[#364365]">People first</h3>
            </div>
            <p class="text-gray-600">
              We're dedicated to helping our members thrive. From finding the
              perfect choose to providing 24/7 support, we put people at the
              center of everything we do.
            </p>
          </div>

          <!-- Value Card 2 -->
          <div
            class="bg-white p-6 rounded-lg shadow-sm hover:transition-all duration-300 hover:scale-105"
          >
            <div class="flex items-center mb-4">
              <i class="bi bi-star-fill text-2xl text-[#364365] mr-2"></i>
              <h3 class="text-xl font-semibold text-[#364365]">Best quality</h3>
            </div>
            <p class="text-gray-600">
              We're passionate about providing excellent service and creating a
              high-quality experience for our community.
            </p>
          </div>

          <!-- Value Card 3 -->
          <div
            class="bg-white p-6 rounded-lg shadow-sm hover:transition-all duration-300 hover:scale-105"
          >
            <div class="flex items-center mb-4">
              <i class="bi bi-grid-fill text-2xl text-[#364365] mr-2"></i>
              <h3 class="text-xl font-semibold text-[#364365]">
                Comprehensive
              </h3>
            </div>
            <p class="text-gray-600">
              Easily browse and filter housing options by location, price, and
              amenities.
            </p>
          </div>

          <!-- Value Card 4 -->
          <div
            class="bg-white p-6 rounded-lg shadow-sm hover:transition-all duration-300 hover:scale-105"
          >
            <div class="flex items-center mb-4">
              <i class="bi bi-shield-check text-2xl text-[#364365] mr-2"></i>
              <h3 class="text-xl font-semibold text-[#364365]">
                Verified Owners
              </h3>
            </div>
            <p class="text-gray-600">
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
<style scoped></style>
