<template>
  <main class="min-h-screen bg-gray-100">
    <div class="md:flex block">
      <!-- Sidebar -->
      <aside class="md:w-48 w-full bg-[#364365] md:min-h-screen p-4">
        <nav class="space-y-2">
          <router-link
            to="/admin/profile"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-person-circle mr-2"></i>Profile
          </router-link>
          <router-link
            to="/admin/real-estate"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-building mr-2"></i>Add Property
          </router-link>
          <router-link
            to="/admin/users"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-people mr-2"></i>users
          </router-link>
          <router-link
            to="/admin/users"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-people mr-2"></i>Owners
          </router-link>
          <router-link
            to="/admin/orders"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-cart mr-2"></i>Requests
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 p-4 md:p-8">
        <!-- Profile Section -->
        <section class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="flex items-center space-x-4">
            <img
              src="../assets/images/userProfilePhoto.jpg"
              alt="Profile"
              class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
            />
            <div>
              <h1 class="text-lg md:text-xl font-semibold text-gray-600">
                Dina Ahmed
              </h1>
              <p class="text-sm md:text-base text-gray-600">
                DinaAhmed@gmali.com
              </p>
            </div>
          </div>
        </section>

        <!-- Edit Profile Form -->
        <section class="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 class="text-lg md:text-xl font-semibold mb-4">Edit Profile</h2>
          <form @submit.prevent>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value="Dina"
                  class="w-full p-2 border rounded bg-gray-100 text-gray-500"
                  disabled
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value="Ahmed"
                  class="w-full p-2 border rounded bg-gray-100 text-gray-500"
                  disabled
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value="DinaAhmed@gmail.com"
                  class="w-full p-2 border rounded bg-gray-100 text-gray-500"
                  disabled
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value="011154151151"
                  class="w-full p-2 border rounded bg-gray-100 text-gray-500"
                  disabled
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value="..."
                  placeholder="Change Password"
                  class="w-full p-2 border rounded bg-gray-100 text-gray-500"
                  disabled
                />
              </div>
              <div>
                <label class="block text-gray-700 mb-2">Nationality</label>
                <input
                  type="text"
                  value="Egypt"
                  class="w-full p-2 border rounded bg-gray-100 text-gray-500"
                  disabled
                />
              </div>
            </div>
            <button
              class="mt-4 px-6 py-2 bg-[#364365] text-white rounded hover:bg-[#2a355e]"
            >
              Edit
            </button>
          </form>
        </section>

        <!-- Orders Grid -->
        <section class="mt-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-[#364365] text-lg md:text-xl font-semibold">
              Owners Requests
            </h2>
            <router-link
              to="/admin/orders"
              class="text-[#364365] hover:underline"
            >
              View all
            </router-link>
          </div>
          <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div
              v-for="item in dummy"
              :key="item.id"
              class="bg-white rounded-lg shadow"
            >
              <img
                :src="item.image"
                alt="Property"
                class="w-full h-40 md:h-48 object-cover"
              />
              <div class="p-4">
                <h3 class="font-semibold text-gray-600">{{ item.title }}</h3>
                <p class="text-gray-600 text-sm">{{ item.location }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import img1 from "@/assets/images/department.jpg";
import img2 from "@/assets/images/department2.jpg";

export default {
  name: "AdminDashboard",
  data() {
    return {
      dummy: [
        {
          id: 2,
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          type: "Condo",
          furnished: false,
          date: "22 Feb 2024",
          image: img2,
          gallery: [img1, img2],
        },
        {
          id: 3,
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
          image: img2,
          gallery: [img1, img2],
        },
        {
          id: 4,
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
          image: img1,
          gallery: [img1, img2],
        },
      ],
    };
  },
};
</script>
