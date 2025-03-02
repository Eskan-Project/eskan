<template>
  <div class="md:p-5 flex justify-center align-middle ">
    <div
      class="container rounded-xl bg-[#364365] grid md:grid-cols-[1fr_1.5fr] grid-cols-1 "
    >
      <div class="img-container hidden md:block p-5 relative rounded-l-xl">
        <img src="@/assets/images/logo-black.png" class="bg-white w-30" />
        <img
          class="rounded-r-xl absolute bottom-0 left-0"
          src="@/assets/images/login/register.png"
        />
      </div>
      <div class="main-text p-8 rounded-xl bg-white">
        <h1 class="text-[#364365] text-3xl text-center font-bold p-5">
          Register Now
        </h1>
        <form action="">
          <div class="mb-6">
            <label for="username" class="text-sm text-[#364365]">Name</label>
            <input
              type="text"
              id="username"
              name="name"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
              required
            />
          </div>
          <div class="mb-6">
            <label for="email" class="text-sm text-[#364365]">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
              required
            />
          </div>
          <div class="mb-6 relative">
            <label for="password" class="text-sm text-[#364365]"
              >Password</label
            >
            <input
              type="password"
              id="password"
              name="password"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
              required
            />
            <i class="bi bi-eye-fill text-black absolute right-0"></i>
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
          <div class=" text-center text-black">
            <p class=" font-medium p-2">please upload your ID </p>
            <div class="border-1 border-stone-400 border-dashed p-5 mx-10 ">
              <label for="file"> <i class="bi bi-cloud-upload text-5xl text-stone-400 cursor-pointer"></i>
              <p>Drag &amp; drop files or <span class="font-bold text-[#364365] cursor-pointer underline decoration-2">Browse</span></p>
              </label>
              <input type="file" id="file" class="hidden" />
              <p class="p-5 text-sm text-stone-400"> support JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT</p>
              
            </div>
   
          </div>
          <button
            type="submit"
            class="cursor-pointer shadow-xl w-full bg-[#364365] hover:bg-white hover:text-[#364365] hover:border-2 hover:border-[#364365] text-white text-sm py-2 my-5"
          >
            Create Account
          </button>
        </form>
        <div>
          <p class="text-black text-xs">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 48 48"
                  class="w-5 h-5"
                >
                  <path
                    fill="#4285F4"
                    d="M24 22v4h10c-.4 2-1.5 3.7-3 5.1l4.6 3.6C38 31.3 40 27 40 24c0-.7-.1-1.3-.2-2H24z"
                  />
                  <path
                    fill="#34A853"
                    d="M10.9 28.2C12.9 32 16.9 35 22 35c3.5 0 6.5-1.1 8.8-3l-4.6-3.6c-1.3.9-3 1.6-4.9 1.6-3.8 0-7-2.6-8.1-6.1l-4.6 3.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.3 15.7C5.5 17.4 5 19.2 5 21s.5 3.6 1.3 5.3l4.6-3.5c-.3-1-.5-2-.5-2.8s.2-1.8.5-2.7l-4.6-3.6z"
                  />
                  <path
                    fill="#EA4335"
                    d="M22 9c3.3 0 6.1 1.1 8.3 3.2l6.1-6.1C32.7 3.1 27.8 1 22 1 16.9 1 12.1 3 8.5 6.3l4.6 3.6C15.7 8.2 18.7 7 22 7z"
                  />
                </svg>
                Google
              </button>

              <button
                class="cursor-pointer flex flex-col md:flex-row items-center gap-2 border border-gray-300 hover:border-gray-500 text-gray-700 py-2 px-4 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="w-5 h-5"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"
                  />
                </svg>
                facebook
              </button>
              <button
                class="cursor-pointer flex flex-col md:flex-row items-center gap-2 border border-gray-300 hover:border-gray-500 text-gray-700 py-2 px-4 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  class="w-5 h-5"
                >
                  <path
                    fill="currentColor"
                    d="M23.643 4.937a9.472 9.472 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.643 9.643 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.374 4.482A13.94 13.94 0 0 1 1.64 3.155a4.916 4.916 0 0 0 1.523 6.565 4.903 4.903 0 0 1-2.229-.616v.061a4.916 4.916 0 0 0 3.946 4.827 4.903 4.903 0 0 1-2.224.085 4.917 4.917 0 0 0 4.6 3.419A9.865 9.865 0 0 1 0 19.541a13.88 13.88 0 0 0 7.548 2.209c9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.015-.634a9.936 9.936 0 0 0 2.435-2.55z"
                  />
                </svg>
                twitter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>
