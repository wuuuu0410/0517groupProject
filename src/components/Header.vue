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
    <RouterLink class="routerItem" to="/4/AboutViewcopy">觀光景點</RouterLink>
</div>

</template>

<style scoped lang="scss">


.headerArea{
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgb(255, 255, 255),#F8C3CD);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .routerItem{
        color: rgb(0, 0, 0);
        font-size: 30px;
        margin: 0 1%;
        text-decoration: none;
        font-weight: 900;
    }
}

</style>