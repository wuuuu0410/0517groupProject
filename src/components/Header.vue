<script>
import { RouterLink, RouterView } from 'vue-router'
import location from '@/stores/location';
import { mapState,mapActions } from 'pinia';
export default{
    data() {
        return {

        };
    },
    created() {
    },

    components:{
        RouterLink,
    },

    computed:{
        ...mapState(location,["page","pageInfo"])
    },

    methods: {

    },
};
    


</script>

<template>



<div class="headerArea">
    <img src="/LOGO2.png" alt="" width="235px" height="235px">
    <RouterLink  class="routerItem" to="/"  :class="{ 'selectPage': this.page === 0 }">Home</RouterLink>
    <RouterLink  class="routerItem" to="/1/1"  :class="{ 'selectPage': this.page === 1  }">交通</RouterLink>
    <RouterLink  class="routerItem" to="/2/2"  :class="{ 'selectPage': this.page === 2  }">活動</RouterLink>
    <RouterLink  class="routerItem" to="/3/3"  :class="{ 'selectPage': this.page === 3 }">餐廳</RouterLink>
    <RouterLink  class="routerItem" to="/4/AboutViewcopy"  :class="{ 'selectPage': this.page === 4  }">觀光景點</RouterLink>
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
        font-weight: 700;
    }
}
.routerItem:hover {
    transform: scale(0.9);
}
.routerItem.selectPage {
    color: rgb(255, 255, 255);
    background: rgb(61, 189, 194);
    border-radius: 10px 10px 10px 10px;
}


</style>