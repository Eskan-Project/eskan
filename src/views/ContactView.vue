<template>
  <section class="md:py-27 pt-20">
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div
        class="grid lg:grid-cols-2 grid-cols-1 md:bg-white bg-none rounded-2xl gap-5"
      >
        <div class="lg:mb-0 mb-10 order-last md:order-first md:ps-0 px-4">
          <div class="group w-full h-full">
            <div class="relative h-full">
              <img
                src="@\assets\images\contact\contact-1.jpg"
                alt="ContactUs tailwind section"
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
          <form action="">
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

            <div class="mb-6">
              <h4 class="text-gray-500 text-lg font-normal leading-7 mb-2">
                Preferred method of communication
              </h4>
              <div class="flex">
                <label class="flex items-center mr-4 cursor-pointer">
                  <input
                    type="radio"
                    v-model="formData.contactMethod"
                    value="email"
                    class="hidden"
                  />
                  <span
                    class="w-4 h-4 border border-gray-300 rounded-full flex justify-center items-center mr-2"
                  >
                    <span
                      v-if="formData.contactMethod === 'email'"
                      class="w-2 h-2 bg-[#364365] rounded-full"
                    ></span>
                  </span>
                  Email
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="formData.contactMethod"
                    value="phone"
                    class="hidden"
                  />
                  <span
                    class="w-4 h-4 border border-gray-300 rounded-full flex justify-center items-center mr-2"
                  >
                    <span
                      v-if="formData.contactMethod === 'phone'"
                      class="w-2 h-2 bg-[#364365] rounded-full"
                    ></span>
                  </span>
                  Phone
                </label>
              </div>
            </div>

            <textarea
              v-model="formData.message"
              class="w-full h-24 text-gray-600 placeholder-gray-400 bg-transparent text-lg shadow-sm font-normal leading-7 rounded-xl border border-gray-200 focus:outline-none pl-4 mb-4"
              placeholder="Message"
            ></textarea>

            <button
              type="submit"
              class="w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-700 bg-[#364365] hover:bg-white hover:text-[#364365] hover:border-2 hover:border-[#364365] shadow-sm"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        phone: "",
        contactMethod: "email",
        message: "",
      },
    };
  },
};
</script>
