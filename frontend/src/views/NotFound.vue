<template>
    <div class="text-white flex flex-col  items-center h-[100vh] pt-20">
      <h1>404 - Page Not Found</h1>
      <p class="mt-6">The page you are looking for does not exist.</p>
      <div class="flex justify-center">
                <router-link class="mt-4 hover:text-blue-500" to="/chat">Go to chat page</router-link>
            </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>
  