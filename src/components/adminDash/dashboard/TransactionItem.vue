<template>
    <div class="flex items-center">
      <img :src="icon" :alt="title" class="w-10 h-10 rounded-full mr-4" />
      <div>
        <h4 class="font-semibold">{{ title }}</h4>
        <p class="text-sm text-gray-400">{{ subtitle }}</p>
      </div>
      <span class="ml-auto font-semibold">{{ amount }}</span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      icon: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        required: true,
      },
    },
  };
  </script>