<script >
import TopCarousel from '@/components/TopCarousel.vue';

export default {
    data() {
        return {
            newsDataList:[],
            myCarouselImg:[
            { image: '/消息輪播1.jpg'},
            { image: '/消息輪播2.jpg'},
            { image: '/消息輪播3.png'},
            { image: '/消息輪播4.jpg'},
            { image: '/消息輪播5.jpg'},
            ],
        };
    },
    created() {
        this.getNewsdata();

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


    }
};
</script>

<template>
    <TopCarousel :carouselImg = "myCarouselImg" />
    <p>最新消息</p>
    <div class="newsList" v-for="item in newsDataList">
        <ul ><a :href="item.Source" target="_blank"><h3>{{ item.title }}</h3></a><br>
        <li><strong>活動開始時間:</strong>{{ item.活動開始時間 }} <strong>&nbsp;&nbsp;&nbsp;活動結束時間:</strong>{{ item.活動結束時間 }}</li>
        </ul>
    </div>

    <div class="footer">
        <a class="logo_a" href="https://www.gov.taipei/" target="_blank">
            <img class="taipei_city_logo" src="/tpe_logo.jpg" alt="">
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

.newsList{
    width: 65%;
    height: 16dvh;
    padding: 1% ;
    margin: 0 auto;
    border: 1px solid black;
    background: rgb(240, 255, 255);

}
h3{
    font-size: 20px;
    font-weight: 900;
}

li{
    list-style: none;
}
a{
    text-decoration: none;
    color: rgb(0, 0, 0);
}
p{
    text-align: center;
    font-size: 30px;
    font-weight: 900;
}

.footer{
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-evenly;
    padding: 3%;

}

.logo_a{
    width: 15%;
    height: 15%;
}

.taipei_city_logo{
    width: 100%;
    height: 100%;
}
</style>