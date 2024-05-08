<script setup>

fetch("../public/RestaurantList.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

  })



</script>

<template>

</template>

<style>

</style>