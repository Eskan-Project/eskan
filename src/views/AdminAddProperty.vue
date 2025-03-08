<template>
  <main class="min-h-screen bg-gray-100 flex-1 p-4 md:p-8">
    <div class="md:flex block">
      <div class="flex-1 p-4 md:p-8">
        <form @submit.prevent="addNewProperty">
          <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
              <h2 class="text-base/7 font-semibold text-gray-900">
                Add Property
              </h2>
              <p class="mt-1 text-sm/6 text-gray-600">
                This information will be displayed to the users to see the
                details about the property
              </p>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <!-- Property Title -->
              <div class="sm:col-span-4">
                <label
                  for="title"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Property Title</label
                >
                <div class="mt-2">
                  <input
                    required
                    v-model="title"
                    type="text"
                    name="title"
                    id="title"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Apartment for sale"
                  />
                </div>
              </div>

              <!-- Property Type -->
              <div class="sm:col-span-3">
                <label
                  for="type"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Property Type</label
                >
                <div class="mt-2 grid grid-cols-1">
                  <select
                    v-model="propertyType"
                    id="type"
                    name="type"
                    class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Villa</option>
                    <option>Studio</option>
                    <option>Office</option>
                  </select>
                  <ChevronDownIcon
                    class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <!-- Property Status -->
              <div class="sm:col-span-3">
                <label
                  for="status"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Property Status</label
                >
                <div class="mt-2 grid grid-cols-1">
                  <select
                    v-model="propertyStatus"
                    id="status"
                    name="status"
                    class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option>second-hand</option>
                    <option>new</option>
                    <option>renovated</option>
                  </select>
                  <ChevronDownIcon
                    class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <!-- Price -->
              <div class="sm:col-span-3">
                <label
                  for="price"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Price</label
                >
                <div class="mt-2">
                  <input
                    required
                    v-model="price"
                    type="number"
                    name="price"
                    id="price"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="290000"
                  />
                </div>
              </div>
              <!-- Size -->
              <div class="sm:col-span-3">
                <label
                  for="size"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Size (sqm)</label
                >
                <div class="mt-2">
                  <input
                    required
                    v-model="size"
                    type="number"
                    name="size"
                    id="size"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="150"
                  />
                </div>
              </div>
              <!-- Rooms, Living Rooms, Bathrooms -->
              <div class="sm:col-span-2">
                <label
                  for="rooms"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Bedrooms</label
                >
                <div class="mt-2">
                  <input
                    required
                    v-model="rooms"
                    type="number"
                    name="rooms"
                    id="rooms"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="3"
                  />
                </div>
              </div>

              <div class="sm:col-span-2">
                <label
                  for="livingRooms"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Living Rooms</label
                >
                <div class="mt-2">
                  <input
                    required
                    v-model="livingRooms"
                    type="number"
                    name="livingRooms"
                    id="livingRooms"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="4"
                  />
                </div>
              </div>

              <div class="sm:col-span-2">
                <label
                  for="bathRooms"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Bathrooms</label
                >
                <div class="mt-2">
                  <input
                    required
                    v-model="bathRooms"
                    type="number"
                    name="bathRooms"
                    id="bathRooms"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="2"
                  />
                </div>
              </div>
              <!-- Furnished -->
              <div class="sm:col-span-3">
                <div class="flex items-center gap-x-3">
                  <div class="flex h-6 shrink-0 items-center">
                    <div class="group grid size-4 grid-cols-1">
                      <input
                        required
                        v-model="furnished"
                        id="furnished"
                        name="furnished"
                        type="checkbox"
                        class="col-start-1 row-start-1 rounded-sm border"
                      />
                    </div>
                  </div>
                  <label
                    for="furnished"
                    class="block text-sm/6 font-medium text-gray-900"
                    >Furnished</label
                  >
                </div>
              </div>
              <!-- Video URL -->
              <div class="sm:col-span-4">
                <label
                  for="video"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Video URL</label
                >
                <div class="mt-2">
                  <input
                    required
                    v-model="videoUrl"
                    type="url"
                    name="video"
                    id="video"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="https://www.youtube.com/watch?v=7wZ2WZxgjw4"
                  />
                </div>
              </div>

              <!-- Property Description -->
              <div class="col-span-full">
                <label
                  for="description"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Description</label
                >
                <div class="mt-2">
                  <textarea
                    v-model="description"
                    name="description"
                    id="description"
                    rows="3"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Describe the property..."
                  ></textarea>
                </div>
              </div>

              <!-- Location -->
              <div class="col-span-full">
                <h3 class="block text-sm/6 font-medium text-gray-900">
                  Location
                </h3>
                <div
                  class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                >
                  <div class="sm:col-span-2">
                    <label
                      for="city"
                      class="block text-sm/6 font-medium text-gray-900"
                      >City</label
                    >
                    <div class="mt-2">
                      <input
                        required
                        v-model="city"
                        type="text"
                        name="city"
                        id="city"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="London"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-2">
                    <label
                      for="street"
                      class="block text-sm/6 font-medium text-gray-900"
                      >Street</label
                    >
                    <div class="mt-2">
                      <input
                        required
                        v-model="street"
                        type="text"
                        name="street"
                        id="street"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="Oxford St."
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-2">
                    <label
                      for="country"
                      class="block text-sm/6 font-medium text-gray-900"
                      >Country</label
                    >
                    <div class="mt-2 grid grid-cols-1">
                      <select
                        v-model="country"
                        id="country"
                        name="country"
                        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option>Egypt</option>
                        <option>KSA</option>
                        <option>UAE</option>
                        <option>Jordan</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Coordinates -->
              <div class="sm:col-span-6">
                <label
                  for="googleMap"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Google Map Link</label
                >
                <div class="mt-2">
                  <input
                    required
                    v-model="googleMapUrl"
                    type="url"
                    name="googleMap"
                    id="googleMap"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="https://www.google.com/maps/place/30.0444,31.2357"
                  />
                </div>
              </div>

              <!-- Interior Features -->
              <div class="col-span-full">
                <h2 class="block text-sm/2 font-bold text-gray-900">
                  Interior Features
                </h2>
                <div
                  class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                >
                  <!-- Modern Kitchen -->
                  <div class="sm:col-span-3 flex items-center gap-x-3">
                    <input
                      id="ModernKitchen"
                      name="kitchen"
                      type="checkbox"
                      v-model="interiorFeatures"
                      value="Modern Kitchen"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      for="Modern Kitchen"
                      class="text-sm/6 font-medium text-gray-900"
                    >
                      Modern Kitchen
                    </label>
                  </div>

                  <!--  Air Conditioning -->
                  <div class="sm:col-span-3 flex items-center gap-x-3">
                    <input
                      id="air"
                      name="air"
                      type="checkbox"
                      v-model="interiorFeatures"
                      value="Air Conditioning"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      for="air"
                      class="text-sm/6 font-medium text-gray-900"
                    >
                      Air Conditioning
                    </label>
                  </div>

                  <!-- Spacious Living Room -->
                  <div class="sm:col-span-3 flex items-center gap-x-3">
                    <input
                      id="SpaciousLivingRoom"
                      name="Spacious Living Room"
                      type="checkbox"
                      v-model="interiorFeatures"
                      value="Spacious Living Room"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      for="Spacious Living Room"
                      class="text-sm/6 font-medium text-gray-900"
                    >
                      Swimming Pool
                    </label>
                  </div>

                  <!-- Built-in Wardrobes -->
                  <div class="sm:col-span-3 flex items-center gap-x-3">
                    <input
                      id="Wardrobes"
                      name="Wardrobes"
                      type="checkbox"
                      v-model="interiorFeatures"
                      value="Built-in Wardrobes"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      for="Wardrobes"
                      class="text-sm/6 font-medium text-gray-900"
                    >
                      Built-in Wardrobes
                    </label>
                  </div>

                  <!-- Hardwood Flooring -->
                  <div class="sm:col-span-3 flex items-center gap-x-3">
                    <input
                      id="hardwood"
                      name="hardwood"
                      type="checkbox"
                      v-model="interiorFeatures"
                      value="Hardwood Flooring"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      for="hardwood"
                      class="text-sm/6 font-medium text-gray-900"
                    >
                      Hardwood Flooring
                    </label>
                  </div>
                </div>
              </div>

              <!-- External Features -->
              <div class="col-span-full">
                <h3 class="block text-sm/6 font-bold text-gray-900">
                  External Features
                </h3>
                <div
                  class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                >
                  <!-- Garden -->
                  <div class="sm:col-span-3 flex items-center gap-x-3">
                    <input
                      id="garden"
                      name="garden"
                      type="checkbox"
                      v-model="externalFeatures"
                      value="garden"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      for="garden"
                      class="text-sm/6 font-medium text-gray-900"
                    >
                      Garden
                    </label>
                  </div>

                  <!-- Balcony -->
                  <div class="sm:col-span-3 flex items-center gap-x-3">
                    <input
                      id="balcony"
                      name="balcony"
                      type="checkbox"
                      v-model="externalFeatures"
                      value="balcony"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      for="balcony"
                      class="text-sm/6 font-medium text-gray-900"
                    >
                      Balcony
                    </label>
                  </div>

                  <!-- Swimming Pool -->
                  <div class="sm:col-span-3 flex items-center gap-x-3">
                    <input
                      id="pool"
                      name="pool"
                      type="checkbox"
                      v-model="externalFeatures"
                      value="pool"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      for="pool"
                      class="text-sm/6 font-medium text-gray-900"
                    >
                      Swimming Pool
                    </label>
                  </div>

                  <!-- Parking -->
                  <div class="sm:col-span-3 flex items-center gap-x-3">
                    <input
                      id="parking"
                      name="parking"
                      type="checkbox"
                      v-model="externalFeatures"
                      value="parking"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      for="parking"
                      class="text-sm/6 font-medium text-gray-900"
                    >
                      Parking
                    </label>
                  </div>
                </div>
              </div>
              <!-- Gallery Images and Property Contract -->
              <div class="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 class="block text-sm/6 font-bold text-gray-900 py-4">
                    Property Images
                  </h3>
                  <images-add
                    @images="handleImages"
                    :isMultiple="true"
                    icon="bi bi-images"
                  >
                    <template #header>Posting Photos</template>
                    <template #underIcon
                      >You can Add up to 30 Images per add</template
                    >
                  </images-add>
                </div>

                <div>
                  <h3 class="block text-sm/6 font-bold text-gray-900 py-4">
                    Property Contract
                  </h3>
                  <images-add
                    @images="handleContract"
                    :isMultiple="true"
                    icon="bi bi-file-earmark-arrow-up-fill"
                  >
                    <template #header>Add Property Contract</template>
                    <template v-slot:underIcon
                      >Please upload the Property Contract</template
                    >
                  </images-add>
                </div>
              </div>

              <!-- Owner Information -->
              <div class="col-span-full">
                <h3 class="block text-sm/6 font-bold text-gray-900">
                  Owner Information
                </h3>
                <div
                  class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                >
                  <!-- Owner Name -->
                  <div class="sm:col-span-3">
                    <label
                      for="ownerName"
                      class="block text-sm/6 font-medium text-gray-900"
                      >Owner Name</label
                    >
                    <div class="mt-2">
                      <input
                        required
                        v-model="ownerName"
                        type="text"
                        name="ownerName"
                        id="ownerName"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <!-- Owner Phone -->
                  <div class="sm:col-span-3">
                    <label
                      for="ownerPhone"
                      class="block text-sm/6 font-medium text-gray-900"
                      >Owner Phone</label
                    >
                    <div class="mt-2">
                      <input
                        required
                        v-model="ownerPhone"
                        type="tel"
                        name="ownerPhone"
                        id="ownerPhone"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="+44 7911 123456"
                      />
                    </div>
                  </div>

                  <!-- Owner Email -->
                  <div class="sm:col-span-3">
                    <label
                      for="ownerEmail"
                      class="block text-sm/6 font-medium text-gray-900"
                      >Owner Email</label
                    >
                    <div class="mt-2">
                      <input
                        required
                        v-model="ownerEmail"
                        type="email"
                        name="ownerEmail"
                        id="ownerEmail"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="johndoe@email.com"
                      />
                    </div>
                  </div>

                  <!-- Owner Address -->
                  <div class="sm:col-span-3">
                    <label
                      for="ownerAddress"
                      class="block text-sm/6 font-medium text-gray-900"
                      >Owner Address</label
                    >
                    <div class="mt-2">
                      <input
                        required
                        v-model="ownerAdders"
                        type="text"
                        name="ownerAddress"
                        id="ownerAddress"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="123 Main St, London, UK"
                      />
                    </div>
                  </div>

                  <!-- Owner Profile Picture -->
                  <div class="col-span-full">
                    <images-add
                      @images="handleOwnerProfilePic"
                      :isMultiple="false"
                      icon="bi bi-person-circle"
                    >
                      <template #header>Owner Profile Picture</template>
                      <template v-slot:underIcon
                        >Please upload the owner Profile Pic</template
                      >
                    </images-add>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="col-span-full">
                <button
                  type="submit"
                  class="rounded-md bg-indigo-600 px-4 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add Property
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { serverTimestamp } from "firebase/database";
import Swal from "sweetalert2";

import ImagesAdd from "@/components/adminDash/ImagesAdd.vue";

export default {
  components: { ImagesAdd },
  data() {
    return {
      title: "",
      country: "",
      city: "",
      street: "",
      googleMapUrl: "",
      description: "",
      lat: null,
      lng: null,
      price: null,
      size: null,
      rooms: null,
      livingRooms: null,
      bathRooms: null,
      propertyType: null,
      propertyStatus: null,
      furnished: null,
      interiorFeatures: [],
      externalFeatures: [],
      images: null,
      videoUrl: null,
      propertyContract: null,
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      ownerAdders: "",
      ownerProfilePicUrl: "",
    };
  },

  methods: {
    handleOwnerProfilePic(profilePic) {
      this.ownerProfilePicUrl = profilePic;
    },
    handleContract(contract) {
      this.propertyContract = contract;
    },
    handleImages(images) {
      this.images = images;
    },
    async addNewProperty() {
      this.extractLatLng();
      const newProperty = {
        id: new Date().toISOString(),
        data: {
          date: serverTimestamp(),
          title: this.title,
          location: `${this.street}, ${this.city}, ${this.country}`,
          description: this.description,
          price: this.price,
          size: this.size,
          rooms: this.rooms,
          livingRooms: this.livingRooms,
          bathRooms: this.bathRooms,
          type: this.propertyType,
          status: this.propertyStatus,
          furnished: this.furnished,
          gallery: this.images,
          interiorFeatures: this.interiorFeatures,
          externalFeatures: this.externalFeatures,
          coordinates: { latitude: this.lat, longitude: this.lng },
          video: this.videoUrl,
          isActive: true,
        },
        ApartmentOwnershipContract: this.propertyContract,
        owner: {
          name: this.ownerName,
          phone: this.ownerPhone,
          email: this.ownerEmail,
          profilePic: this.ownerProfilePicUrl,
          address: this.ownerAdders,
        },
        requestStatus: 1,
        paymentStatus: true,
        lastUpdated: serverTimestamp(),
        rejectionReason: "",
        onlineMeetingStatus: "done",
        comments: [{}],
      };

      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "this Property is going to be added!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, confirm ",
        });

        // If user cancels, exit the function
        if (!result.isConfirmed) return;

        const response = await fetch(
          "https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties.json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newProperty),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        // Show success notification
        await Swal.fire("Done!", "Your property has been Added.", "success");
        // Redirect to homepage after successful deletion
        this.$router.push("/admin/properties");
      } catch (error) {
        console.error("Added failed:", error);
        this.error = `Failed to add property: ${error.message}`;
      }
    },
    extractLatLng() {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = this.googleMapUrl.match(regex);

      if (match) {
        this.lat = parseFloat(match[1]);
        this.lng = parseFloat(match[2]);
        return {
          latitude: this.lat,
          longitude: this.lng,
        };
      } else {
        console.error("Could not extract coordinates from Google Maps URL");
        return null;
      }
    },
  },
};
</script>
