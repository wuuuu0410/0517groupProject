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
    <RouterLink class="routerItem" to="/2/2">住宿</RouterLink>
    <RouterLink class="routerItem" to="/3/3">餐廳</RouterLink>
    <RouterLink class="routerItem" to="/4/4">觀光景點</RouterLink>
</div>

</template>

<style scoped lang="scss">


.headerArea{
    width: 100%;
    height: 100%;
    background: #F8C3CD;

    .routerItem{
        color: white;
        font-size: 24px;
        margin: 0 1%;
        text-decoration: none;
    }
}

</style>