<template>
    
    <div class="bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden ">
      <img :src="property.image" alt="Property Image" class="w-full h-48 object-cover">
      <div class="p-4">
        <h2 class="font-bold text-md">{{ property.title }}</h2>
        <p class="text-gray-500">{{ property.location }}</p>
        <p class="font-bold text-sm">{{ property.price }} $</p>
        <div class="flex justify-between text-gray-600 mt-5">
          <span><i class="bi bi-buildings-fill pr-1" style="color: var(--secondary-color);" ></i>{{ property.size }} m²</span>
          <span><i class="bi bi-house-fill pr-1" style="color: var(--secondary-color);"></i>{{ property.rooms }} Rooms</span>
          <span><i class="bi bi-h-square pr-1" style="color: var(--secondary-color);"></i>{{ property.units }}</span>
        </div>
      </div>
    </div>

  </template>
  
  <script>
  export default {
    props: {
      property: Object,
    },
  };
  </script>
  