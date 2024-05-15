<script>
import location from '@/stores/location';
import { mapState,mapActions } from 'pinia';
export default {
    data() {
        return {
            selectedArea: '',
            areas: [],
            stations: []
        };
    },
    async created() {
        await this.fetchData();
    },
    mounted() {
        this.setPage(1)
    },
    methods: {
        ...mapActions(location,["setPage"]),
        async fetchData() {
            try {
                const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                this.stations = data;
                this.areas = Array.from(new Set(data.map(station => station.sarea)));
            } catch (error) {
                console.error(error);
            }
        },
        formatArea(area) {
            return area.replace('YouBike2.0_', '');
        },
        formatStationName(name) {
            return name.replace('YouBike2.0_', '');
        }
    },
    computed: {
        ...mapState(location,["page","pageInfo"]),
        filteredStations() {
            return this.stations.filter(station => station.sarea === this.selectedArea);
        }
    }
};
</script>


<template>

    <div class="header">
        <img src="https://www.youbike.com.tw/region/assets/images/logo.svg" alt="">
        <!-- <div class="dropmenu"></div> -->
        <ul class="drop-down-menu">
            <li><a href="#">使用說明</a>
                <ul style="padding: 0;">
                    <li><a href="">註冊方式</a>
                    </li>
                    <li><a href="">借還方式</a>
                    </li>
                    <li><a href="">設備介紹</a>
                    </li>
                    <li><a href="">騎乘須知</a>
                    </li>
                    <li><a href="">公共自行車保險</a>
                    </li>
                </ul>
            </li>
            <li><a href="https://booking.ubus.com.tw/">收費方式</a>
            </li>
            <li><a href="#">站點資訊</a>
                <ul style="padding: 0;">
                    <li><a href="">站點地圖</a>
                    </li>
                    <li><a href="">站點列表</a>
                    </li>
                </ul>
            </li>
            <li><a href="#">最新消息</a>
                <ul style="padding: 0;">
                    <li><a href="">站點公告</a>
                    </li>
                    <li><a href="">服務公告</a>
                    </li>
                </ul>
            </li>
            <li><a href="https://booking.ubus.com.tw/">活動專區</a>
            </li>
            <li><a href="#">常見問題</a>
                <ul style="padding: 0;">
                    <li><a href="">FAQ</a>
                    </li>
                    <li><a href="">失物招領</a>
                    </li>
                    <li><a href="">YouBike協尋</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>




    <div class="stopList">
        <h1>站點列表</h1>
    </div>


    <div class="chooseArea">

        <!-- 頁籤選單 -->
        <ul class="tabs">
            <li v-for="area in areas" :key="area" :class="{ activeTab: area === selectedArea }"
                @click="selectedArea = area">{{ formatArea(area) }}</li>
        </ul>
    </div>

    <hr>

    <div class="nameArea">
        <div class="dist">
            <p>區域</p>
        </div>
        <div class="stop">
            <p>站點名稱</p>
        </div>
        <div class="rent">
            <p>可借車輛</p>
        </div>
        <div class="dock">
            <P>可歸還空位</P>
        </div>
    </div>

    <div class="bigArea">
        <div class="content" style="display: flex; justify-content: space-around; padding: 0;">
            <div class="1" style="width: 25%;">
                <ul v-for="(station, index) in filteredStations" :key="station.sno" style="list-style: none; margin: 0"
                    :class="{ 'content-bg': index % 2 !== 0 }">
                    <li style=" text-align: center; height: 30px; padding: 1% 0;">
                        {{ station.sarea }}
                    </li>
                </ul>
            </div>
            <div class="2" style="width: 33%;">
                <ul v-for="(station, index) in filteredStations" :key="station.sno" style="list-style: none; margin: 0"
                    :class="{ 'content-bg': index % 2 !== 0 }">
                    <li style="height: 30px; padding: 1% 0; ">
                        {{ formatStationName(station.sna) }}
                    </li>
                </ul>
            </div>
            <div class="3" style="width: 25%;">
                <ul v-for="(station, index) in filteredStations" :key="station.sno" style="list-style: none; margin: 0"
                    :class="{ 'content-bg': index % 2 !== 0 }">
                    <li style="height: 30px; padding: 2% 0; ">
                        {{ station.available_rent_bikes }}
                    </li>
                </ul>
            </div>
            <div class="4" style="width: 25%;">
                <ul v-for="(station, index) in filteredStations" :key="station.sno" style="list-style: none; margin: 0"
                    :class="{ 'content-bg': index % 2 !== 0 }">
                    <li style="height: 30px; padding: 2% 0; ">
                        {{ station.available_return_bikes }}
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="footer">
        <button type="button" class="member">會員條款</button>
        <button type="button" class="privacy">隱私權政策</button>
        <h5>Copyright © 2024 YouBike Co., Ltd v2.23.0</h5>
    </div>
</template>




<style scoped lang="scss">
.header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    border: 1px solid black;
    position: relative;

    img {
        position: absolute;
        width: 100px;
        height: 100px;
        left: 2%;
    }

    ul.drop-down-menu {
    display: inline-block;
    width: 70%;
    list-style: none;
    border: 1px solid red;
    position: absolute;
    top: 25%;
    left: 15%;
}


//改次選單字大小
ul.drop-down-menu li {   
            position: relative;
            left: 0;
            top: 100%;
            white-space: nowrap;
        }

        //改上層選單字大小
        ul.drop-down-menu > li {
            font-size: 22px;    
            float: left;
            width: 15%;
        }
        ul.drop-down-menu a {
            display: block;
            text-align: center;
            text-decoration: none;
                &:hover{
                background:black;
                color: aliceblue;
                }
        }

        //隱藏次選單
        ul.drop-down-menu ul { 
            display: none;
            list-style: none;
            background:aliceblue;
        }

        //滑鼠滑入展開次選單
        ul.drop-down-menu li:hover > ul { 
            display: block;
            font-size: 18px;
            transform: 1s;

        }
    }



.stopList {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    border: 1px solid black;
    font-size: 20px;
    font-weight: bolder;
    background: #ffef00;
}

.chooseArea {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    border: 1px solid black;
    font-weight: bolder;

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 50px;
        border: 1px solid rgb(229, 218, 218);
        border-radius: 0px 50px 50px 0px;
        position: relative;
        transition: 1s;

        // .ubike {
        //     font-size: 25px;
        //     font-weight: bolder;}
    }


    .tabs {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        font-size: 15px;
    }

    .tabs li {
        border-radius: 10px;
        padding: 8px 16px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: black;
            color: aliceblue;
            animation: slideIn 0.3s alternate; // 添加動畫
        }
    }

    // 定義動畫
    @keyframes slideIn {
        from {
            transform: translateY(-5px);
        }
    }
}

hr {
    margin: 5px 5rem;
    background: yellow;
    height: 5px;
    border: none;
}

.nameArea {
    height: 35px;
    display: flex;
    justify-content: space-around;
    position: relative;

    .dist {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 40px;
        height: 25px;
        font-size: 20px;
        font-weight: bolder;
        left: 18%;
    }

    .stop {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 80px;
        height: 25px;
        font-size: 20px;
        font-weight: bolder;
        left: 32%;
    }

    .rent {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 80px;
        height: 25px;
        font-size: 20px;
        font-weight: bolder;
        margin-left: 10%;
        right: 44%;
    }

    .dock {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100px;
        height: 25px;
        font-size: 20px;
        font-weight: bolder;
        right: 24%;
    }

}



.bigArea {
    margin: 0 10%;
    height: 500px;
    border: 1px solid black;

    .content {
        height: 500px;
        border: 1px solid black;
        overflow-y: auto;
    }

    .content-bg {
        background-color: rgb(211, 211, 251);
    }
}

// 內容顏色
.even-row {
    background-color: white;
}

.odd-row {
    background-color: rgb(225, 225, 254);
}

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70px;
    border: 1px solid black;
    font-size: 10px;
    position: relative;

    button {
        width: 80px;
        height: 30px;
        border: 1px solid black;
        border-radius: 10px;
    }
    h5{
        position: absolute;
        font-size: 13px;
        right: 30%;
    }
    .member{
        position: absolute;
        left: 30%;
    }
    .privacy{
        position: absolute;
        left: 40%;
    }
}
</style>