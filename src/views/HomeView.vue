<script >
export default {
    data() {
        return {
            
        };
    },
    created() {
        
    },

    methods: {
        //篩選出台北餐廳後執行getTown()
        async getTaipeiRestaurants() {
            try {
                const response = await fetch('../.json');
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

</template>

<style>

</style>