<template>
  <auth-header />
  <div
    class="md:p-10 flex justify-center items-center h-screen bg-gray-50 dark:bg-[#111827]"
  >
    <div
      class="bg-white dark:bg-[#1F2937] rounded-xl w-screen text-black dark:text-white lg:w-[70vw] shadow-lg"
    >
      <p
        class="md:text-3xl text-lg text-stone-500 dark:text-gray-300 text-center mt-10"
      >
        {{ $t("auth.select_role.welcome") }} <br />
        {{ $t("auth.select_role.subtitle") }}
      </p>
      <div class="grid md:grid-cols-2 grid-cols-1 gap-10 md:p-20 p-5">
        <button
          class="cursor-pointer p-5 md:text-left rounded-xl text-center shadow-sm shadow-black dark:shadow-gray-900 hover:shadow-gray-400 dark:hover:shadow-gray-800 hover:transition-all duration-300 hover:scale-105 bg-white dark:bg-[#1F2937]"
          @click="$router.push({ name: 'registerUser' })"
        >
          <div class="grid md:grid-cols-2 grid-cols-1 p-5 gap-5">
            <p class="text-2xl font-medium dark:text-white">
              {{ $t("auth.select_role.user") }}
            </p>
            <img
              src="@\assets\images\login\registerMain-1.jpg"
              class="shrink block mx-auto"
              loading="lazy"
            />
          </div>
          <p class="dark:text-gray-300">
            {{ $t("auth.select_role.user_description") }}
          </p>
        </button>

        <button
          class="cursor-pointer p-5 md:text-left rounded-xl text-center shadow-sm shadow-black dark:shadow-gray-900 hover:shadow-gray-400 dark:hover:shadow-gray-800 hover:transition-all duration-300 hover:scale-105 bg-white dark:bg-[#1F2937]"
          @click="$router.push({ name: 'registerOwner' })"
        >
          <div class="grid md:grid-cols-2 grid-cols-1 p-5 gap-5">
            <p class="text-2xl font-medium dark:text-white">
              {{ $t("auth.select_role.owner") }}
            </p>
            <img
              src="@\assets\images\login\registerMain-2.jpg"
              class="shrink block mx-auto"
              loading="lazy"
            />
          </div>
          <p class="dark:text-gray-300">
            {{ $t("auth.select_role.owner_description") }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AuthHeader from "@/components/AuthHeader.vue";
export default {
  components: { AuthHeader },
};
</script>
