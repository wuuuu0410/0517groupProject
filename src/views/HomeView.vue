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
    <div class="newsList">
        <ul v-for="item in newsDataList">{{ item.title }}<hr></ul>
    </div>
    
</template>

<style>

.newsList{
    width: 65%;
    border: 1px solid black;
    margin: 0 auto;
}
</style>