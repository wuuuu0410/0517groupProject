<script>
//import location and pinia
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
import TopCarousel from '@/components/TopCarousel.vue';
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
            currentIndex: 0,
            myCarouselImg: [
                { image: '/餐廳輪播圖1.png' },
                { image: '/餐廳輪播圖2.jpg' },
                { image: '/餐廳輪播圖3.png' },
                { image: '/餐廳輪播圖4.jpg' },
                { image: '/餐廳輪播圖5.jpg' },
            ],
            randomNumber: "",
            randomArr: [],
        };
    },

    created() {
        this.getTaipeiRestaurants();  //從全台灣餐廳過濾出臺北市餐廳
    },

    mounted() {
        this.setPage(3)
    },

    components: {
        TopCarousel
    },

    computed: {
        ...mapState(location, ["page", "pageInfo"])
    },

    methods: {
        ...mapActions(location, ["setPage"]),
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
                this.getRandomCards()
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
            const select = document.querySelector("#vue3select")
            this.selectValue = select.value;
            this.selectList = [];
            for (let i = 0; i < this.taipeiRestaurantsList.length; i++) {
                if (this.taipeiRestaurantsList[i].PostalAddress.Town == this.selectValue) {
                    this.selectList.push(this.taipeiRestaurantsList[i])
                }
            }
            console.log(this.selectList)
        },
        prevSlide() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            }
        },
        nextSlide() {
            if (this.currentIndex < this.selectList[currentIndex].length - 1) {
                this.currentIndex++;
            }
        },
        getRandomCards() {
            this.randomArr = [];
            for (let i = 0; i < 4; i++) {
                this.randomNumber = Math.floor(Math.random() * 148);
                this.randomArr.push(this.randomNumber)
            }
            console.log(this.randomArr)
        }
    },
};
</script>



<template>
    <TopCarousel :carouselImg="myCarouselImg" />
    <div class="vue3select">
        <select @change="checkSelect" name="" id="vue3select">
            <option value="">請選擇區域</option>
            <option v-for="item in this.town" v-bind:value="item">{{ item }}</option>
        </select>
    </div>

    <div class="vue3list" v-for="item in selectList">
        <div class="listImages">
            <img v-if="item.Images.length >= 1" v-bind:src="item.Images[0].URL" alt="" width="250px" height="250px">
            <!-- <img v-if="item.Images.length>=2" v-bind:src="item.Images[1].URL" alt="" width="68%" height="68%">
            <img v-if="item.Images.length>=3" v-bind:src="item.Images[2].URL" alt="" width="68%" height="68%"> -->
        </div>

        <div class="ulSpace">
            <ul class="restName vue3Ul">
                <li class="vue3Li">
                    <h2 class="vue3H2">{{ item.RestaurantName }}</h2>
                </li>
                <li class="vue3Li">{{ item.Description }}</li>
                <br>
                <li class="vue3Li">{{ "地址:" + item.PostalAddress.StreetAddress }}</li>
                <li class="vue3Li">{{ "營業時間:" + item.ServiceTimeInfo }}</li>
                <li class="vue3Li"><a :href="item.SameAsURLs" target="_blank">詳細介紹</a> </li>
            </ul>
        </div>
    </div>

    <div class="cards">
        <div class="card" v-for="item in randomArr">
            <a v-bind:href="taipeiRestaurantsList[item].SameAsURLs" target="_blank">
                <div class="cardTopImg">
                    <img class="cardImg" v-bind:src="taipeiRestaurantsList[item].Images[0].URL" alt="" width="100%"
                        height=auto>
                </div>
                <div class="cardBottomText">
                    <h4 class="vue3H4">{{ taipeiRestaurantsList[item].RestaurantName }}</h4><br>
                    <h5 class="vue3H5">{{ taipeiRestaurantsList[item].PostalAddress.City
                        }}&nbsp;{{ taipeiRestaurantsList[item].PostalAddress.Town }}</h5>
                    <h5 class="vue3H5">{{ taipeiRestaurantsList[item].PostalAddress.StreetAddress }}</h5>
                </div>
            </a>
        </div>
    </div>

    <div class="vue3footer">
        <a class="vue3logo_a" href="https://www.gov.taipei/" target="_blank">
            <img class="taipei_city_logo" src="/Logo.svg" alt="">
        </a>
        <div class="footerRight">
            <h3 class="vue3H3">臺北市政府觀光傳播局</h3><br>
            <ul class="vue3Ul">
                <li class="vue3Li">地址 : 110024臺北市信義區市府路1號4樓中央區</li><br>
                <li class="vue3Li">電話 : 02-27208889-代表號 臺北市民當家熱線 1999各科室聯絡電話及傳真</li><br>
                <li class="vue3Li">服務時間 : 周一至周五08:30-12:30,13:30-17:305</li><br>
            </ul>
        </div>
    </div>

</template>




<style>
.headerCarousel {
    width: 100%;
    height: 80dvh;
    border: 1px solid black;
}

.vue3select {
    width: 100%;
    height: 20dvh;
    display: flex;
    align-items: center;
    justify-content: center;
}

#vue3select {
    width: 15%;
    height: 9dvh;
    background: #F8C3CD;
    color: rgb(0, 0, 0);
    font-size: 25px;
    text-align: center;
    border-radius: 10px;
    border: none;
    outline: none;
    font-weight: 700;
    box-shadow: 5px 3px 4px rgb(119, 114, 114);
}

option {
    border: 1px solid black;
}

.vue3list {
    width: 70%;
    margin: 0 auto;
    background-image: url(/list紙.jpeg);
    background-repeat: no-repeat;
    background-size: cover;
    border: 1px solid black;
    display: flex;


}

.restName {
    list-style: none;

}

.listImages {
    width: 25%;
    height: 85%;
    left: 0;
    flex-wrap: wrap;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1%;


}

.ulSpace {
    width: 75%;
    height: 280px;
    padding: 1%;
}

.vue3footer {
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-evenly;
    padding: 3%;
    background: linear-gradient(to right, rgb(255, 255, 255), #F8C3CD);
}

.vue3Li {
    list-style: none;
    font-weight: 600;
}



.vue3logo_a {
    width: 15%;
    height: 15%;
}

.taipei_city_logo {
    width: 100%;
    height: 100%;
}

.cards {
    width: 70%;
    height: 50dvh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px auto;
}

.card {
    width: 23%;
    height: 50dvh;
    background: #fdecef;
    border-radius: 10px;
    box-shadow: 5px 3px 4px rgb(119, 114, 114);
}

.card:hover {
    transform: scale(1.02);
}

.cardTopImg {
    height: auto;
}

.cardBottomText {
    height: auto;
    padding: 5%;
}

.cardImg {
    border-radius: 10px 10px 0 0;
}

.vue3H2 {
    font-weight: 700;
}

.vue3H4 {
    font-weight: 700;
}
</style>