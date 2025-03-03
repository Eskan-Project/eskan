<template>
  <main class="min-h-screen bg-gray-100 pt-[86px] py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Profile Header -->
      <section class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative h-48">
          <img
            class="h-full w-full object-cover"
            src="../assets/images/userProfileCoverPagePhoto.jpg"
            alt="Profile Cover"
          />
          <div class="absolute inset-0 bg-[#053052]/80"></div>
        </div>
        <div class="relative px-6 pb-6">
          <article class="flex flex-col sm:flex-row items-center">
            <figure class="-mt-16 relative">
              <img
                src="../assets/images/userProfilePhoto.jpg"
                alt="Profile"
                class="w-32 h-32 rounded-full border-4 border-white bg-white"
              />
            </figure>
            <div class="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 class="text-2xl font-bold text-gray-900">Alaa Mohamed</h1>
            </div>
            <button
              class="mt-6 sm:mt-0 sm:ml-auto px-4 py-2 bg-[#364365] text-white rounded-lg hover:bg-[#2a355e]"
            >
              Edit Profile
            </button>
          </article>
        </div>
      </section>

      <!-- Profile Content -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
        <!-- Personal Information -->
        <section class="md:col-span-2">
          <article class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">Personal Information</h2>
            <dl class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt class="block text-sm font-medium text-gray-700">
                    Full Name
                  </dt>
                  <dd class="mt-1 text-gray-900">Alaa Mohamed Mostafa</dd>
                </div>
                <div>
                  <dt class="block text-sm font-medium text-gray-700">
                    Nick Name
                  </dt>
                  <dd class="mt-1 text-gray-900">Alaa Mostafa</dd>
                </div>
                <div>
                  <dt class="block text-sm font-medium text-gray-700">Phone</dt>
                  <dd class="mt-1 text-gray-900">+201126355581</dd>
                </div>
                <div>
                  <dt class="block text-sm font-medium text-gray-700">
                    Location
                  </dt>
                  <dd class="mt-1 text-gray-900">Alexandria</dd>
                </div>
                <div>
                  <dt class="block text-sm font-medium text-gray-700">
                    Gender
                  </dt>
                  <dd class="mt-1 text-gray-900">Female</dd>
                </div>
                <div>
                  <dt class="block text-sm font-medium text-gray-700">
                    National ID
                  </dt>
                  <dd class="mt-1 text-gray-900">30001212121554</dd>
                </div>
              </div>
            </dl>
          </article>

          <!-- Properties -->
          <article class="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-900">
              Email Address
            </h2>
            <ul class="space-y-4">
              <li class="border rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-grow">
                    <h3 class="font-semibold text-gray-900">Alaa Mohamed</h3>
                    <address class="text-gray-600 not-italic break-all">
                      AlaaMohamed@gmail.com
                    </address>
                  </div>
                  <span
                    class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm whitespace-nowrap ml-4"
                    role="status"
                  >
                    Active
                  </span>
                </div>
              </li>
            </ul>
          </article>
        </section>

        <!-- Account Settings -->
        <!-- <aside class="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 class="text-xl font-semibold mb-4">Account Settings</h2>
          <nav class="space-y-4">
            <button
              class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Privacy Settings
            </button>
            <button
              class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Notification Preferences
            </button>
            <button
              class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Payment Methods
            </button>
            <button
              class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Security
            </button>
          </nav>
        </aside> -->
      </div>
    </div>
  </main>
</template>
