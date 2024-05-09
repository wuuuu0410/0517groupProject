<script>
export default {
    data() {
        return {
            //taipeiRestaurantsList收集臺北市餐廳
            taipeiRestaurantsList:[],
            //town收集台北市行政區
            town:[],
            //selectList收集與select.value相符的餐廳
            selectList:[],
            selectValue:"",
        };
    },
    created() {
        this.getTaipeiRestaurants();  //從全台灣餐廳過濾出臺北市餐廳
    },
    mounted(){
        this.getTown();
    },
    methods: {
    async getTaipeiRestaurants() {
            try {
                const response = await fetch('../RestaurantList.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
                const data = await response.json();
                console.log(data)
                for(let i = 0; i<data.Restaurants.length;i++){
                    if(data.Restaurants[i].PostalAddress.City=="臺北市"){
                        this.taipeiRestaurantsList.push(data.Restaurants[i]);
                    } 
                }
                console.log(this.taipeiRestaurantsList);
            } catch (error) {
                console.error(error);
            }
        },
        getTown(){
            for(let i=0; i<this.taipeiRestaurantsList.length; i++){
                this.town.push(this.taipeiRestaurantsList[i].PostalAddress.Town)
                }
            const set = new Set();
            this.town = this.town.filter(item => !set.has(item) ? set.add(item) : false);
            console.log(this.town);
        },
        //比對select選取的value,並收集相同行政區的餐廳
        checkSelect(){
            const select = document.querySelector("#select")
            this.selectValue=select.value;
            this.selectList = [];
            for(let i=0; i<this.taipeiRestaurantsList.length;i++){
                if(this.taipeiRestaurantsList[i].PostalAddress.Town==this.selectValue){
                    this.selectList.push(this.taipeiRestaurantsList[i])
                }
            }
            console.log(this.selectList)
        }
    }
};
</script>



<template>

    <input type="text">
    <select @change="checkSelect" name="" id="select">
        <option value="">請選擇區域</option>
        <option v-for="item in this.town" v-bind:value="item">{{ item }}</option>
    </select> 
    <button type="button">搜尋</button>
    <div class="a">
    <h2>{{ taipeiRestaurantsList[1].RestaurantName }}</h2>
    <ul v-for="item in selectList">{{ item.RestaurantName }} </ul>
    </div>
    
</template>




<style>

</style>