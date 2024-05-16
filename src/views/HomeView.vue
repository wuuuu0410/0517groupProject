<script>
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
import TopCarousel from '@/components/TopCarousel.vue';

export default {
    data() {
        return {
            newsDataList: [],
            currentDataList: [],
            myCarouselImg: [
                { image: '/消息輪播1.jpg' },
                { image: '/消息輪播2.jpg' },
                { image: '/消息輪播3.png' },
                { image: '/消息輪播4.jpg' },
                { image: '/消息輪播5.jpg' },
            ],
            currentPage: 0,
            itemsPerPage: 9,
            isActive: 0,
            ndImgs: [
                { image: '/home圖3.png' },
                { image: '/home圖2.jpg' },
                { image: '/home圖4.jpg' },
                { image: '/home圖1.jpg' },
            ],
            bears: [],
        };
    },
    created() {
        this.getNewsdata();
    },
    mounted() {
        this.isActive = 0;
        this.setPage(0);
        this.generateBears();
    },
    computed: {
        ...mapState(location, ["page", "pageInfo"]),
        pages() {
            const pages = [];
            for (let i = 0; i < this.newsDataList.length; i += this.itemsPerPage) {
                pages.push(this.newsDataList.slice(i, i + this.itemsPerPage));
            }
            return pages;
        },
        buttons() {
            return Array.from({ length: Math.ceil(this.newsDataList.length / this.itemsPerPage) }, (_, index) => index + 1);
        }
    },
    components: {
        TopCarousel
    },

    methods: {
        ...mapActions(location, ["setPage"]),
        async getNewsdata() {
            try {
                const response = await fetch('../最新消息.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log(data)
                console.log(data[0].title)
                this.newsDataList = data;
                console.log(this.newsDataList);
            } catch (error) {
                console.error(error);
            }
        },
        changePage(index) {
            this.currentPage = index;
            window.scrollTo({ top: 770, behavior: 'smooth' });
            this.isActive = index;
        },
        generateBears() {
            for (let i = 0; i < 30; i++) {
                const bear = {
                    style: {
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 5 + 4}s`,
                    },
                };
                this.bears.push(bear);
            }
        }
    }
};
</script>

<template>
    <TopCarousel :carouselImg="myCarouselImg" />
    <div class="ndArea">
        <img class="ndImg" v-for="img in ndImgs" v-bind:src="img.image" alt="" width="280px" height="160">
    </div>
    <div class="homeBackground">
        <div class="bears">
            <div class="bear" v-for="(bear, index) in bears" :key="index" :style="bear.style">
                <img src="/bear.png" alt="" width="100px" height="100px">
            </div>
        </div>
        <p class="newTitle homeP">最新消息</p>
        <div v-for="(page, index) in pages" :key="index" v-show="currentPage === index">
            <div class="newsList" v-for="(item, itemIndex) in page" :key="itemIndex">
                <ul class="homeUl">
                    <a :href="item.Source" target="_blank">
                        <h3 class="homeH3">{{ item.title }}</h3>
                    </a>

                    <li class="homeLi"><strong>活動開始時間:</strong>{{ item.活動開始時間 }}
                        <strong>&nbsp;&nbsp;&nbsp;活動結束時間:</strong>{{ item.活動結束時間 }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="buttonList">
            <button class="buttons" v-for="(button, index) in buttons" :key="index" @click="changePage(index)"
                :class="{ 'active': isActive === index }">{{ button }}</button>
        </div>
    </div>
    <div class="video-container">
        <iframe class="homeVideo" width="650" height="400" src="https://www.youtube.com/embed/YXah8wCDnyc"
            frameborder="0" allowfullscreen></iframe>
        <iframe class="homeVideo" width="650" height="400" src="https://www.youtube.com/embed/w-HpyyXcwBE"
            frameborder="0" allowfullscreen></iframe>
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
.homeBackground {
    position: relative;
}

.bears {
    position: absolute;
    top: 0;
    left: 0;
    width: 96%;
    pointer-events: none;
    z-index: -1;
}

.bear {
    position: absolute;
    font-size: 2em;
    opacity: 1;
    animation: fallingAndRotating 15s linear infinite; 
}

@keyframes fallingAndRotating {
    0% {
        transform: translateY(-10%) rotate(0deg); /* 初始位置和旋转角度 */
    }
    100% {
        transform: translateY(1000%) rotate(360deg); /* 结束位置和旋转角度 */
    }
}

.newsList {
    width: 65%;
    height: 12dvh;
    padding: 1%;
    margin: 0 auto;
    border: 1px solid black;
    background: #fcdde3;
}

.homeLi {
    list-style: none;
    color: #69747C;
}

a {
    text-decoration: none;
    color: #34373a;
}

.ndArea {
    width: 100%;
    height: 25dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(61, 189, 194);

    .ndImg {
        margin: 0 8px;
        border-radius: 10px;
    }
}

.newTitle {
    font-size: 35px;
    font-weight: 700;
    margin: 2% 0;
    text-align: center;
}

.homefooter {
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-evenly;
    padding: 3%;

}

.homeH3 {
    font-size: 24px;
    font-weight: 700;
}

.video-container {
    width: 100%;
    height: 50dvh;
    background: rgb(61, 189, 194);
    display: flex;
    justify-content: center;
    align-items: center;
}

.homeVideo {
    margin: 0 10px;
    border-radius: 10px;
}

.logo_a {
    width: 15%;
    height: 15%;
}

.taipei_city_logo {
    width: 100%;
    height: 100%;
}

.buttonList {
    width: 100%;
    height: 10dvh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.buttons {
    width: 40px;
    height: 40px;
    margin: 0 0.5%;
    font-weight: 700;
    background: #F8C3CD;
    color: #69747C;
    border-radius: 50%;
    border: none;
}

.buttons:hover {
    transform: scale(1.2);
}

.buttons:active {
    color: #F8C3CD;
    background: #69747C;
}

.buttons.active {
    background: #d81871;
    color: #F8C3CD;
}
</style>