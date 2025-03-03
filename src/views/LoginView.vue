<template>
  <div class="md:p-10  flex justify-center h-screen md:h-[auto]">
    <div
      class="bg-white rounded-xl grid md:grid-cols-2 grid-cols-1 lg:w-[60vw]"
    >
      <div class="main-text p-8 rounded-l-xl">
        <h1 class="text-[#364365] text-3xl text-center font-bold p-5">
          Welcome Back
        </h1>
        <form action="">
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
            <a
              class="text-[#364365] text-sm text-right pt-4 cursor-pointer block underline"
            >
              Forget Your Password?
            </a>
          </div>
          <div class="p-5">
            <button
              type="submit"
              class="border cursor-pointer shadow-xl w-full bg-[#364365] hover:bg-white hover:text-[#364365] hover:border-[#364365] text-white text-sm py-2 px-4 rounded-lg"
            >
              Sign In
            </button>
          </div>
        </form>
        <div>
          <div
            class="text-[#364365] font-medium text-sm flex justify-center align-baseline gap-2 my-4 text-center"
          >
            <span class="border-b-1 w-20 self-center"></span>
            <p>Or sign in with</p>
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
              Don't have an account?
              <a
                class="text-blue-500 hover:text-blue-700 cursor-pointer"
                @click.prevent="$router.push({ name: 'register' })"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
      <div class="img-container hidden md:block">
        <img
          class="w-full h-full rounded-r-xl"
          src="@/assets/images/login/login.png"
        />
      </div>
    </div>
  </div>
</template>
