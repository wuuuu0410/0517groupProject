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
    <img src="/titleTaipei.png" alt="" width="150px" height="90px">
    <RouterLink class="routerItem" to="/">Home</RouterLink>
    <RouterLink class="routerItem" to="/1/1">交通</RouterLink>
    <RouterLink class="routerItem" to="/2/2">住宿</RouterLink>
    <RouterLink class="routerItem" to="/3/3">餐廳</RouterLink>
    <RouterLink class="routerItem" to="/4/AboutViewcopy">觀光景點</RouterLink>
    <img src="/headertaipei.png" alt="" width="280px" height="200px">
</div>

</template>

<style scoped lang="scss">


.headerArea{
    width: 100%;
    height: 100%;
    background: linear-gradient(to right,#F8C3CD,rgb(255, 255, 255));
    text-align: center;
    display: flex;
    justify-content:space-between;
    align-items: center;
    .routerItem{
        color: rgb(0, 0, 0);
        font-size: 30px;
        text-decoration: none;
        font-weight: 900;
    }
}
.routerItem:hover {
    transform: scale(1.2);
}


</style>