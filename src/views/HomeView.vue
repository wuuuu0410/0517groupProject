<script >
import TopCarousel from '@/components/TopCarousel.vue';


export default {
    data() {
        return {
            newsDataList:[],
            myCarouselImg:[
            { image: '../public/1.jpg' },
            { image: '../public/2.jpg' },
            { image: '../public/3.jpg' },
            // { image: '../public/4.jpg' },
            // { image: '../public/5.jpg' },
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
        <li><strong>活動開始時間:</strong>{{ item.活動開始時間 }} <strong>活動結束時間:</strong>活動結束時間:{{ item.活動結束時間 }}</li>
        </ul>
    </div>
    
</template>

<style>

.newsList{
    width: 65%;
    height: 12dvh;
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

</style>