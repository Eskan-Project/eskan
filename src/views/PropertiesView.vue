<template>
  <div class="properties">
    <div
      class="relative w-full mx-auto h-[350px] bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImage})` }"
    >
      <div class="absolute inset-0 bg-black/40"></div>
      <div
        class="relative z-10 flex justify-center items-center h-full w-full max-w-4xl text-gray-500 mx-auto p-4"
      >
        <div
          class="bg-white rounded-lg px-2 py-2 shadow-lg w-full flex flex-wrap md:flex-nowrap gap-3 md:gap-2 lg:gap-4 justify-center md:justify-between items-center"
        >
          <input
            type="text"
            placeholder="🔍 Search by keyword"
            class="border px-2 py-2 rounded-md w-full text-sm block md:hidden"
          />
          <div
            class="w-full md:flex md:flex-wrap lg:flex-nowrap gap-2 md:gap-2 lg:gap-4 hidden md:flex"
          >
            <select
              class="hover:bg-gray-500 hover:text-white hover:shadow-lg hover:rounded-md p-2 rounded-md text-sm w-full md:w-1/5 lg:w-auto"
            >
              <option disabled selected>📍 Location</option>
              <option>🗽 New York</option>
              <option>🌆 Los Angeles</option>
              <option>🌉 San Francisco</option>
              <option>🏝️ Miami</option>
              <option>🏙️ Chicago</option>
              <option>🌆 Houston</option>
              <option>🏛️ Washington D.C.</option>
            </select>
            <select
              class="hover:bg-gray-500 hover:text-white hover:shadow-lg hover:rounded-md p-2 rounded-md text-sm w-full md:w-1/5 lg:w-auto"
            >
              <option disabled selected>🏠 Housing Type</option>
              <option>🏢 Apartment</option>
              <option>🏡 Villa</option>
              <option>🏘️ Townhouse</option>
              <option>🏬 Studio</option>
              <option>🌇 Penthouse</option>
            </select>
            <select
              class="hover:bg-gray-500 hover:text-white hover:shadow-lg hover:rounded-md p-2 rounded-md text-sm w-full md:w-1/5 lg:w-auto"
            >
              <option disabled selected>💲 Price Range</option>
              <option>💵 Less than $100,000</option>
              <option>💰 $100,000 - $200,000</option>
              <option>💵 $200,000 - $500,000</option>
              <option>💰 $500,000 - $1,000,000</option>
              <option>💎 More than $1,000,000</option>
            </select>
            <select
              class="hover:bg-gray-500 hover:text-white hover:shadow-lg hover:rounded-md p-2 rounded-md text-sm w-full md:w-1/5 lg:w-auto"
            >
              <option disabled selected>🛏️ Rooms</option>
              <option>1️⃣ Room</option>
              <option>2️⃣ Rooms</option>
              <option>3️⃣ Rooms</option>
              <option>4️⃣ Rooms</option>
              <option>5️⃣+ Rooms</option>
            </select>
          </div>
          <button
            class="bg-black text-white px-4 py-2 rounded-md w-full md:w-auto transition hover:bg-gray-800"
          >
            Search
          </button>
        </div>
      </div>
    </div>
    <div class="container mx-auto py-10 px-5">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PropertyCard
          v-for="(property, index) in paginatedProperties"
          :key="index"
          :property="property"
        />
      </div>
      <div class="flex justify-center mt-10 text-gray-500">
        <button
          class="px-3 py-2 border rounded-md mx-1"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="px-3 py-2 border rounded-md mx-1"
          :class="{ 'bg-gray-300': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-2 border rounded-md mx-1"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PropertyCard from "@/components/PropertyCard.vue";
// import propertiesBg from "@/assets/images/properties.png";
// import propertyImage from "@/assets/images/department.png";
// import propertyImage1 from "@/assets/images/department.jpg";
// import propertyImage2 from "@/assets/images/department2.jpg";
// import propertyImage3 from "@/assets/images/department3.jpg";
// import propertyImage4 from "@/assets/images/department4.jpg";

export default {
  components: { PropertyCard },
  data() {
    return {
      bgImage: propertiesBg,
      currentPage: 1,
      perPage: 12,
      properties: [
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage1,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage2,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage1,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage2,
        },
        {
          title: "Family House",
          location: "Los Angeles, CA",
          price: "380,000",
          size: "200",
          rooms: "5",
          units: "2",
          image: propertyImage3,
        },
        {
          title: "Modern Loft",
          location: "San Francisco, CA",
          price: "310,000",
          size: "130",
          rooms: "2",
          units: "8",
          image: propertyImage4,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage3,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage4,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage1,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage2,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage3,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage4,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage1,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage2,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage3,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage4,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage1,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage2,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage3,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage4,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage,
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: propertyImage,
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: propertyImage,
        },
      ],
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.properties.length / this.perPage);
    },
    paginatedProperties() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.properties.slice(start, end);
    },
    visiblePages() {
      return Array.from(
        { length: Math.min(this.totalPages, 5) },
        (_, i) => i + 1
      );
    },
  },
  methods: {
    goToPage(page) {
      this.currentPage = page;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<style scoped>
.properties {
  background-color: #f8f8f8;
}
</style>
