<template>
  <div class="md:p-5 flex justify-center align-middle">
    <div class=" bg-white rounded-xl  w-screen text-black">
      <img src="@/assets/images/logo-black.png" class="block mx-auto" />
      <p class='md:text-3xl text-lg text-stone-500 text-center '>
        Welcome to ESKAN! <br />
        Choose your role and start your journey with us
      </p>
      <div class="grid md:grid-cols-2 grid-cols-1  gap-10 md:p-20 p-5 " >
 

        <button  class="cursor-pointer  p-5 md:text-left rounded-xl text-center shadow-sm shadow-black " @click="$router.push({name:'registerUser'})">
            <div class="grid md:grid-cols-2 grid-cols-1 p-5 gap-5">
                <p class="text-2xl  font-medium ">Register <br>
                    As an <span class='text-[#364365] font-bold '>Owner</span>
                </p>
                <img src="@\assets\images\login\registerMain-1.png" class='shrink block mx-auto'>
            </div>
            <p>Manage your properties, track tenants,and streamline 
                your business operations efficiently</p>
         </button>



         <button  class="cursor-pointer shadow-sm shadow-black  p-5 md:text-left rounded-xl text-center " @click="$router.push({name:'registerUser'})">
            <div class="grid md:grid-cols-2 grid-cols-1 p-5 gap-5">
                <p class="text-2xl  font-medium ">Register <br>
                    As an <span class='text-[#364365] font-bold '>Owner</span>
                </p>
                <img src="@\assets\images\login\registerMain-2.png" class='shrink block mx-auto'>
            </div>
            <p>Manage your properties, track tenants,and streamline 
                your business operations efficiently</p>
         </button>

  
  
    </div>
  </div>
</div>
</template>
<style scoped>
*{
    /* border: 2px solid red; */
}

</style>