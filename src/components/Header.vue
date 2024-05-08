<script>
import { RouterLink, RouterView } from 'vue-router'
export default{
    components:{
        RouterLink,
    }
}
</script>

<template>
<div class="headerArea">
    <RouterLink class="routerItem" to="/">Home</RouterLink>
    <RouterLink class="routerItem" to="/1/1">交通</RouterLink>
    <RouterLink class="routerItem" to="/2/2">2</RouterLink>
    <RouterLink class="routerItem" to="/3/3">餐廳</RouterLink>
    <RouterLink class="routerItem" to="/4/4">4</RouterLink>
</div>

</template>

<style scoped lang="scss">
body{
    background: white;
}

.headerArea{
    width: 100%;
    height: 100%;
    background: black;

    .routerItem{
        color: white;
        font-size: 24px;
        margin: 0 1%;
        text-decoration: none;
    }
}

</style>