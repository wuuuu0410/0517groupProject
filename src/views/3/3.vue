<script setup>
fetch("../public/RestaurantList.json")

.then(res => res.json())

.then(data =>{
    console.log(data)
})
</script>



<template>



</template>




<style>
.a{
    width: 100%;
    height: 20dvh;
    background: bisque;
}
</style>