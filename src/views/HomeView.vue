<script >
import TopCarousel from '@/components/TopCarousel.vue';

export default {
    data() {
        return {
            newsDataList:[],
            currentDataList:[],
            myCarouselImg:[
            { image: '/消息輪播1.jpg'},
            { image: '/消息輪播2.jpg'},
            { image: '/消息輪播3.png'},
            { image: '/消息輪播4.jpg'},
            { image: '/消息輪播5.jpg'},
            ],
            currentPage: 0, 
            itemsPerPage: 10,
        };
    },
    created() {
        this.getNewsdata();
    },
    computed: {
      pages() {
        const pages = [];
        for (let i = 0; i < this.newsDataList.length; i += this.itemsPerPage) {
          pages.push(this.newsDataList.slice(i, i + this.itemsPerPage));
        }
        return pages;
      },
      // 生成按钮文本
      buttons() {
        return Array.from({ length: Math.ceil(this.newsDataList.length / this.itemsPerPage) }, (_, index) => index + 1);
      }
    },
    components:{
        TopCarousel
    },

    methods: {

        async getNewsdata() {
            try {
                const response = await fetch('../最新消息.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log(data)
                console.log(data[0].title)
                this.newsDataList=data;
                console.log(this.newsDataList);
            } catch (error) {
                console.error(error);
            }
        },
        changePage(index) {
            this.currentPage = index;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

    }
};
</script>

<template>
    <TopCarousel :carouselImg = "myCarouselImg" />
    <p class="newTitle homeP">最新消息</p>
    <!-- <div class="newsList" v-for="item in newsDataList">
        <ul class="homeUl"><a :href="item.Source" target="_blank"><h3>{{ item.title }}</h3></a><br>
        <li class="homeLi"><strong>活動開始時間:</strong>{{ item.活動開始時間 }} <strong>&nbsp;&nbsp;&nbsp;活動結束時間:</strong>{{ item.活動結束時間 }}</li>
        </ul>
    </div> -->
    <div v-for="(page, index) in pages" :key="index" v-show="currentPage === index">
        <div class="newsList" v-for="(item, itemIndex) in page" :key="itemIndex">
            <ul class="homeUl">
                <a :href="item.Source" target="_blank">
                    <h3>{{ item.title }}</h3>
                </a>
                <br>
                <li class="homeLi"><strong>活動開始時間:</strong>{{ item.活動開始時間 }} <strong>&nbsp;&nbsp;&nbsp;活動結束時間:</strong>{{ item.活動結束時間 }}</li>
            </ul>
        </div>
    </div>
    <div class="buttonList">
        <button class="buttons" v-for="(button, index) in buttons" :key="index" @click="changePage(index)">{{ button }}</button>
    </div>

    <div class="homefooter">
        <a class="logo_a" href="https://www.gov.taipei/" target="_blank">
            <img class="taipei_city_logo" src="/Logo.svg" alt="">
        </a>
        <div class="footerRight">
        <h3 class="homeH3">臺北市政府觀光傳播局</h3><br>
            <ul class="homeUl">
                <li class="homeLi">地址 : 110024臺北市信義區市府路1號4樓中央區</li><br>
                <li class="homeLi">電話 : 02-27208889-代表號 臺北市民當家熱線 1999各科室聯絡電話及傳真</li><br>
                <li class="homeLi">服務時間 : 周一至周五08:30-12:30,13:30-17:305</li><br>
            </ul>
        </div>
    </div>

</template>

<style>

.newsList{
    width: 65%;
    height: 16dvh;
    padding: 1% ;
    margin: 0 auto;
    border: 1px solid black;
    background: #fcdde3;
}

.homeLi{
    list-style: none;
}
a{
    text-decoration: none;
    color: rgb(0, 0, 0);
}

.newTitle{
    font-size: 35px;
    font-weight: 700;
    margin: 2% 0;
    text-align: center;
}
.homefooter{
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-evenly;
    padding: 3%;

}

.homeH3{
    font-size: 16px;
    font-weight: 100;
}

.logo_a{
    width: 15%;
    height: 15%;
}

.taipei_city_logo{
    width: 100%;
    height: 100%;
}

.buttonList{
    width: 100%;
    height: 5dvh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.buttons{
    width: 25px;
    height: 30px;
    margin: 0 0.5%;
    background: black;
    color: white;
}
</style>