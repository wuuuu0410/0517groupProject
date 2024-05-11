<script>
export default {
    data() {
        return {
            //taipeiRestaurantsList收集臺北市餐廳
            taipeiRestaurantsList: [],
            //town收集台北市行政區
            town: [],
            //selectList收集與select.value相符的餐廳
            selectList: [],
            selectValue: "",
        };
    },
    created() {
        this.getTaipeiRestaurants();  //從全台灣餐廳過濾出臺北市餐廳
    },

    methods: {
        //篩選出台北餐廳後執行getTown()
        async getTaipeiRestaurants() {
            try {
                const response = await fetch('../RestaurantList.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log(data)
                for (let i = 0; i < data.Restaurants.length; i++) {
                    if (data.Restaurants[i].PostalAddress.City == "臺北市") {
                        this.taipeiRestaurantsList.push(data.Restaurants[i]);
                    }
                }
                console.log(this.taipeiRestaurantsList);
                this.getTown();
            } catch (error) {
                console.error(error);
            }
        },
        //取得行政區
        getTown() {
            for (let i = 0; i < this.taipeiRestaurantsList.length; i++) {
                this.town.push(this.taipeiRestaurantsList[i].PostalAddress.Town)
            }
            const set = new Set();
            this.town = this.town.filter(item => !set.has(item) ? set.add(item) : false);
            console.log(this.town);
        },
        //比對select選取的value,並收集相同行政區的餐廳
        checkSelect() {
            const select = document.querySelector("#select")
            this.selectValue = select.value;
            this.selectList = [];
            for (let i = 0; i < this.taipeiRestaurantsList.length; i++) {
                if (this.taipeiRestaurantsList[i].PostalAddress.Town == this.selectValue) {
                    this.selectList.push(this.taipeiRestaurantsList[i])
                }
            }
            console.log(this.selectList)
        }
    }
};
</script>



<template>
    <div class="headerCarousel"></div>
    <div class="select">
    <select @change="checkSelect" name="" id="select">
        <option value="">請選擇區域</option>
        <option v-for="item in this.town" v-bind:value="item">{{ item }}</option>
    </select>
    </div>

    <div class="list" v-for="item in selectList">
        <div class="listImages">
            <img v-if="item.Images.length>=1" v-bind:src="item.Images[0].URL" alt="" width="100px" height="100px">
            <img v-if="item.Images.length>=2" v-bind:src="item.Images[1].URL" alt="" width="100px" height="100px">
            <img v-if="item.Images.length>=3" v-bind:src="item.Images[2].URL" alt="" width="100px" height="100px">
        </div>
        <div class="ulSpace">
            <ul class="restName" >
                <li><h2>{{ item.RestaurantName }}</h2></li>
                <li>{{ item.PostalAddress.StreetAddress }}</li>
                <li>{{ item.ServiceTimeInfo }}</li>
            </ul>
        </div>
    </div>

    <div class="card">
        
    </div>

</template>




<style>
.headerCarousel{
    width: 100%;
    height: 80dvh;
    border: 1px solid black;
}

.select{
    width: 100%;
    height: 10dvh;
    display: flex;
    align-items: center;
    justify-content: center;
}

#select{
    width: 25%;
    height: 5dvh;
    background: black;
    color: white;
    font-size: 25px;
    text-align: center;
}
.list{
    width: 70%;
    margin: 0 auto;
    /* background-image: url(../public/紙.jpg); */
    background-repeat: no-repeat;
    background-size: cover;
    border: 1px solid black;
    display: flex;
    
}
.restName{
    list-style: none;

}
.listImages{
    width: 20%;
    height: 300px;
    left: 0;
    flex-wrap: wrap;
}
.ulSpace{
    width: 80%;
    height: 300px;
}
</style>