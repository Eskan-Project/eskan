<template>
  <main class="min-h-screen bg-gray-100 flex-1 p-4 md:p-8">
    <div class="md:flex block">
      <div class="flex-1 p-4 md:p-8">
        <form>
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
                    type="text"
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
                        id="country"
                        name="country"
                        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option>United Kingdom</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Australia</option>
                      </select>
                      <ChevronDownIcon
                        class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Coordinates -->
              <div class="sm:col-span-3">
                <label
                  for="latitude"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Latitude</label
                >
                <div class="mt-2">
                  <input
                    type="number"
                    step="0.0001"
                    name="latitude"
                    id="latitude"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="30.0444"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label
                  for="longitude"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Longitude</label
                >
                <div class="mt-2">
                  <input
                    type="number"
                    step="0.0001"
                    name="longitude"
                    id="longitude"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="31.2357"
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
              <!-- Gallery Images -->
              <div class="col-span-full">
                <h3 class="block text-sm/6 font-bold text-gray-900">
                  Gallery Images
                </h3>
                <div class="mt-4">
                  <input
                    type="file"
                    id="gallery"
                    name="gallery"
                    multiple
                    accept="image/*"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p class="mt-2 text-sm/6 text-gray-500">
                    Upload multiple images for the property gallery.
                  </p>
                </div>
              </div>

              <!-- Apartment Ownership Contract -->
              <div class="col-span-full">
                <h3 class="block text-sm/6 font-bold text-gray-900">
                  Ownership Contract
                </h3>
                <div class="mt-4">
                  <input
                    type="file"
                    id="contract"
                    name="contract"
                    accept=".pdf"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p class="mt-2 text-sm/6 text-gray-500">
                    Upload the ownership contract in PDF format.
                  </p>
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
                    <label
                      for="ownerProfilePic"
                      class="block text-sm/6 font-medium text-gray-900"
                      >Owner Profile Picture</label
                    >
                    <div class="mt-2">
                      <input
                        type="file"
                        id="ownerProfilePic"
                        name="ownerProfilePic"
                        accept="image/*"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      <p class="mt-2 text-sm/6 text-gray-500">
                        Upload a profile picture for the owner.
                      </p>
                    </div>
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

<script></script>
