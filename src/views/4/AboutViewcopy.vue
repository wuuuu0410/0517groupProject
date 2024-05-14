<script setup>
import { ref } from 'vue';
import axios from 'axios';

async function getSpots2(page) {

    //如果當前頁面等於 0 則當前頁面等於 1
    if (page == 0) {
        page = 1
    }
    //如果當前頁面等於 11 則當前頁面等於 10
    if (page == 11) {
        page = 10
    }

    try {
        // this.isloading = true;
        let spotdata = await axios.get('../spotData' + page + '.json')
        spots.value = spotdata.data
        console.log(spots)
        console.log(123)
    } catch (error) {
        console.log(error);
        console.log(321)
    }
    nowPage = page
}

let nowPage = 1;




let spots = ref({});
getSpots2(1)

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]


</script>

<template>


    <div class="body">

        <div class="third bigArea">

            <div class="second">
                <img class="young" src="https://www.travel.taipei/Content/images/content/must-visit/list/Attractions-m.jpg" alt="">
            </div>

            <div class="topTitlee">
                <h1 class="location">精選景點</h1>
            </div>
            <div class="thirdBox" v-for="item in arr">
                <div class="leftPhoto">
                    <img style="width: 100%; height: 100%; border-radius: 5%;" v-if="spots.data[item].images != ''"
                        v-bind:src="spots.data[item].images[0].src" alt="" width="300px">
                    <img style="width: 100%; height: 100%; border-radius: 5%;" v-else
                        src="https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1581909112681.jpg" alt=""
                        width="300px">
                </div>
                <div class="rightText">
                    <h1 class="title">{{ spots.data[item].name }}</h1>
                    <div class="bbox">
                        <p>{{ spots.data[item].introduction }}</p>
                    </div>


                    <p class="related">相關連結</p>
                    <a class="aaa" :href="spots.data[item].facebook" target="_blank">
                        <p class="link">{{ spots.data[item].name }}</p>
                    </a>

                    <!-- <p>
                        <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                            :data-bs-target="'#' + item" aria-expanded="false" :aria-controls="collapseExample">
                            簡介
                        </button>
                    </p>
                    <div class="collapse" :id="item">
                        <div class="card card-body">
                            <p>{{ spots.data[item].introduction }}</p>
                        </div>
                    </div> -->
                </div>


            </div>

            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" @click="getSpots2(nowPage - 1)" href="#">上一頁</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(1)" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(2)" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(3)" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(4)" href="#">4</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(5)" href="#">5</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(6)" href="#">6</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(7)" href="#">7</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(8)" href="#">8</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(9)" href="#">9</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(10)" href="#">10</a></li>
                    <li class="page-item"><a class="page-link" @click="getSpots2(nowPage + 1)" href="#">下一頁</a></li>
                </ul>
            </nav>

            <!-- <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
                <span>{{ currentPage }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
            </div> -->

            <div class="footer">
                <img class="taipei" src="/TaipeiCity.jpg" alt="">
                <p class="p1">臺北市政府觀光傳播局</p>
                <p class="p2">地址 : 110024臺北市信義區市府路1號4樓中央區</p>
                <p class="p3">電話 : 02-27208889-代表號 臺北市民當家熱線 1999各科室聯絡電話及傳真</p>
                <p class="p4">服務時間 : 周一至周五08:30-12:30,13:30-17:30</p>
            </div>
        </div>

    </div>



</template>

<style scoped lang="scss">
// *{
//     box-sizing: border-box;
//     padding: 0;
//     margin: 0;
// }

.body {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

}

.second {
    width: 100%;
    height: 60dvh;
    // border: 1px solid blue;

    .young {
        width: 100%;
        height: 100%;
    }
}

.third {
    height: 100%;
    width: 70%;
    // border: 1px solid black;

    .location {
        margin: 2% 0;
        text-align: left;
        color: #1d83c1;

    }

    .thirdBox {
        width: 100%;
        height: 45dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5%;

        .card-body {
            z-index: 1;
        }
    }

    .leftPhoto {
        width: 45%;
        height: 100%;
        border: 1px solid black;
        border-radius: 5%;
        // height: 50%;
        // border: 1px solid red;
    }

    .rightText {
        width: 55%;
        height: 100%;
        // height: 45dvh;
        // border: 1px solid red;
        padding-left: 5%;
        position: relative;

        .bbox{
            width: 600px;
            height: 65%;
            border: 1px solid black;
            overflow: scroll;
            overflow-x: hidden;
        }
    }

    .related {
        color: #566ea7;
        position: absolute;
        left: 8.5%;
        bottom: 9%;
    }

    .link {
        color: #017978;
        position: absolute;
        left: 8.5%;
        bottom: 1%;
        transition: 0.5s;

        &:hover{
            scale: 1.1;
        }
    }

    .title {
        margin-bottom: 2%;
    }

    .related {
        margin-top: 8%;
        margin-bottom: 1%;
    }

    .pagination {
        justify-content: center;
        margin-bottom: 5%;
        
        .page-link{
            border: none;
            &:hover{
                background: #e8e9ec;
                scale: 1.2;
            }
        }
        
    }

}

.footer {
    width: 100%;
    height: 20dvh;
    // border: 1px solid yellow;
    position: relative;

    .taipei {
        width: 150px;
        height: 150px;
        background: rgba(255, 255, 255, 0);
    }

    .p1 {
        position: absolute;
        top: 17%;
        left: 15%;
    }

    .p2 {
        position: absolute;
        top: 32%;
        left: 15%;
    }

    .p3 {
        position: absolute;
        top: 47%;
        left: 15%;
    }

    .p4 {
        position: absolute;
        top: 62%;
        left: 15%;
    }
}
</style>