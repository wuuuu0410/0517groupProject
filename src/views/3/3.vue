<script>
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
            myCarouselImg:[
            { image: '/餐廳輪播圖1.png' },
            { image: '/餐廳輪播圖2.jpg' },
            { image: '/餐廳輪播圖3.png' },
            { image: '/餐廳輪播圖4.jpg' },
            { image: '/餐廳輪播圖5.jpg' },
            { image: '/餐廳輪播圖6.jpg' },
            ],
            randomNumber:"",
            randomArr:[],
        };
    },
    components:{
        TopCarousel
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
            const select = document.querySelector("#select")
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
            this.randomArr=[];
            for(let i = 0 ; i<4; i++){
                this.randomNumber = Math.floor(Math.random() * 148) ;
                this.randomArr.push(this.randomNumber)
            }
            console.log(this.randomArr)
        }   
    },
};
</script>



<template>
    <TopCarousel :carouselImg = "myCarouselImg" />
    <div class="select">
        <select @change="checkSelect" name="" id="select">
            <option value="">請選擇區域</option>
            <option v-for="item in this.town" v-bind:value="item">{{ item }}</option>
        </select>
    </div>

    <div class="list" v-for="item in selectList" >
        <div class="listImages">
            <img v-if="item.Images.length>=1" v-bind:src="item.Images[0].URL" alt="" width="68%" height="68%">
            <!-- <img v-if="item.Images.length>=2" v-bind:src="item.Images[1].URL" alt="" width="68%" height="68%">
            <img v-if="item.Images.length>=3" v-bind:src="item.Images[2].URL" alt="" width="68%" height="68%"> -->
        </div>

        <div class="ulSpace">
            <ul class="restName">
                <li>
                    <h2>{{ item.RestaurantName }}</h2>
                </li>
                <li>{{ item.Description }}</li>
                <br>
                <li>{{ "地址:" + item.PostalAddress.StreetAddress }}</li>
                <li>{{ "營業時間:" + item.ServiceTimeInfo }}</li>
                <li><a :href="item.SameAsURLs" target="_blank">詳細介紹</a> </li>
            </ul>
        </div>
    </div>

    <div class="cards">
        <div class="card"v-for="item in randomArr">
            <div class="cardTopImg" >
                <img class="cardImg" v-bind:src="taipeiRestaurantsList[item].Images[0].URL" alt="" width="100%" height=auto>
            </div>
            <div class="cardBottomText">
                <a v-bind:href="taipeiRestaurantsList[item].SameAsURLs" target="_blank"><h2>{{taipeiRestaurantsList[item].RestaurantName}}</h2></a><br>
                <h4>{{taipeiRestaurantsList[item].PostalAddress.City }}&nbsp;{{taipeiRestaurantsList[item].PostalAddress.Town }}</h4>
                <h4>{{taipeiRestaurantsList[item].PostalAddress.StreetAddress }}</h4>
            </div>
        </div>
    </div>

    <div class="footer">
        <a class="logo_a" href="https://www.gov.taipei/" target="_blank">
            <img class="taipei_city_logo" src="/Logo.svg" alt="">
        </a>
        <div class="footerRight">
        <h3>臺北市政府觀光傳播局</h3><br>
            <ul>
                <li>地址 : 110024臺北市信義區市府路1號4樓中央區</li><br>
                <li>電話 : 02-27208889-代表號 臺北市民當家熱線 1999各科室聯絡電話及傳真</li><br>
                <li>服務時間 : 周一至周五08:30-12:30,13:30-17:305</li><br>
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

.select {
    width: 100%;
    height: 10dvh;
    display: flex;
    align-items: center;
    justify-content: center;
}

#select {
    width: 25%;
    height: 5dvh;
    background:#F8C3CD;
    color: rgb(0, 0, 0);
    font-size: 25px;
    text-align: center;
    border-radius: 10px;
    border: none;
    font-weight: 900;
}
option{
    border: 1px solid black;
}

.list {
    width: 70%;
    margin: 0 auto;
    /* background-image: url(../public/紙.jpg); */
    background-repeat: no-repeat;
    background-size: cover;
    border: 1px solid black;
    display: flex;

}

.restName {
    list-style: none;

}

.listImages {
    width: 35%;
    height: 85%;
    left: 0;
    flex-wrap: wrap;
    display: flex;
    justify-content: center;
    align-items: center;
    

}

.slide{
        width:"68%";
        height:"68%"
    }
    
.ulSpace {
    width: 65%;
    height: 280px;
}

.footer{
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-evenly;
    padding: 3%;
    background: linear-gradient(to right, rgb(255, 255, 255),#F8C3CD);
}

li{
    list-style: none;
    }

.logo_a{
    width: 15%;
    height: 15%;
}

.taipei_city_logo{
    width: 100%;
    height: 100%;
}

.cards{
    width: 70%;
    height: 50dvh;
    display: flex;
    justify-content:space-around;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 20px;
}
.card{
    width: 23%;
    height: 50dvh;
    border: 1px solid black;
    border-radius: 10px;
    background: #fdecef
}
.cardTopImg{
        height: auto;
    }
.cardBottomText{
        height: auto;
        padding: 5%;
    }
.cardImg{
    border-radius: 10px 10px 0 0;
}
</style>