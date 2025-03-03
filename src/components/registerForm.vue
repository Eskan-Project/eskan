<script>
export default {
  props: {
    actionlink: {
      type: String,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
  },
};
</script>

<template>
  <div class="md:p-10 flex justify-center align-middle ">
    <div
      class="container rounded-xl bg-[#364365] grid md:grid-cols-[1fr_1.5fr] grid-cols-1 lg:w-[75vw]"
    >
      <div class="img-container hidden md:block p-5 relative rounded-l-xl">
        <img src="@/assets/images/logo-black.png" class="bg-white w-30" />
        <img
          class="rounded-r-xl absolute bottom-0 left-0"
          src="@/assets/images/login/register.png"
        />
      </div>
      <div class="main-text p-8 rounded-r-xl bg-white">
        <h1 class="text-[#364365] text-3xl text-center font-bold p-5">
          {{ title }}
        </h1>
        <form :action="actionlink">
          <div class="mb-6">
            <label for="username" class="block mb-1 text-[#364365]">Name</label>
            <input
              type="text"
              id="username"
              name="name"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
              required
            />
          </div>
          <div class="mb-6">
            <label for="email" class="block mb-1 text-[#364365]">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
              required
            />
          </div>
          <div class="mb-6 relative">
            <label for="password" class="block mb-1 text-[#364365]"
              >Password</label
            >
            <input
              type="password"
              id="password"
              name="password"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
              required
            />
            <i class="bi bi-eye-fill text-black absolute right-2"></i>
          </div>
          <div class="mb-6">
            <label for="password" class="text-sm text-[#364365]"
              >Confirm Password</label
            >
            <input
              type="password"
              name="password"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
              required
            />
          </div>
          <div v-if="isOwner" class="text-center text-black">
            <p class="font-medium p-2">please upload your ID</p>
            <div class="border-1 border-stone-400 border-dashed p-5 mx-10">
              <label for="file">
                <i
                  class="bi bi-cloud-upload text-5xl text-stone-400 cursor-pointer"
                ></i>
                <p>
                  Drag &amp; drop files or
                  <span
                    class="font-bold text-[#364365] cursor-pointer underline decoration-2"
                    >Browse</span
                  >
                </p>
              </label>
              <input type="file" id="file" class="hidden" />
              <p class="p-5 text-sm text-stone-400">support JPEG, PNG, JPG</p>
            </div>
          </div>
          <button
            type="submit"
            class="border cursor-pointer shadow-xl w-full bg-[#364365] hover:bg-white hover:text-[#364365] hover:border-[#364365] text-white text-sm py-2 px-4 rounded-lg mt-6"
          >
            Create Account
          </button>
        </form>
        <div>
          <div
            class="text-[#364365] font-medium text-sm flex justify-center align-baseline gap-2 my-4 text-center"
          >
            <span class="border-b-1 w-20 self-center"></span>
            <p>Or sign Up with</p>
            <span class="border-b-1 w-20 self-center"></span>
          </div>
          <div class="logs">
            <div class="flex justify-center align-center gap-2 p-5">
              <button
                class="cursor-pointer flex flex-col md:flex-row items-center gap-2 bg-white border border-gray-300 hover:border-gray-500 text-gray-700 py-2 px-4 rounded-lg"
              >
                <i class="bi bi-google"></i>
                Google
              </button>

              <button
                class="cursor-pointer flex flex-col md:flex-row items-center gap-2 border border-gray-300 hover:border-gray-500 text-gray-700 py-2 px-4 rounded-lg"
              >
                <i class="bi bi-facebook"></i>
                facebook
              </button>

              <button
                class="cursor-pointer flex flex-col md:flex-row items-center gap-2 border border-gray-300 hover:border-gray-500 text-gray-700 py-2 px-4 rounded-lg"
              >
                <i class="bi bi-twitter"></i>
                twitter
              </button>
            </div>
            <p class="text-black text-center">
              Already have an accoun?
              <a
                class="text-blue-500 hover:text-blue-600 cursor-pointer"
                @click.prevent="
                  $router.push({
                    name: 'login',
                  })
                "
                >Log In</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
