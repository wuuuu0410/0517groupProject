<script>
import location from '@/stores/location';
import { mapState, mapActions } from 'pinia';
export default {
    data() {
        return {
            selectedArea: '',
            areas: [],
            stations: [],
        };
    },
    async created() {
        await this.fetchData();
    },
    mounted() {
        this.setPage(1)
    },
    methods: {
        ...mapActions(location, ["setPage"]),
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
        },
    },
    computed: {
        ...mapState(location, ["page", "pageInfo"]),
        filteredStations() {
            return this.stations.filter(station => station.sarea === this.selectedArea);
        }
    }
};
</script>


<template>

    <div class="header">
        <div id="title"  class="title">
            <img class="ubikeImg" src="/ubike.svg" alt="" width="200px" height="100px" >
            <h1>站點列表</h1>
        </div>
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
            <div class="distcontent" style="width: 25%;">
                <ul v-for="(station, index) in filteredStations" :key="station.sno" style="list-style: none; margin: 0"
                    :class="{ 'content-bg': index % 2 !== 0 }">
                    <li style=" text-align: center; height: 30px; padding: 1% 0;">
                        {{ station.sarea }}
                    </li>
                </ul>
            </div>
            <div class="arconcent" style="width: 33%;">
                <ul v-for="(station, index) in filteredStations" :key="station.sno" style="list-style: none; margin: 0"
                    :class="{ 'content-bg': index % 2 !== 0 }">
                    <li style="height: 30px; padding: 1% 0; ">
                        {{ formatStationName(station.sna) }}
                    </li>
                </ul>
            </div>
            <div class="rentcontent" style="width: 25%;">
                <ul v-for="(station, index) in filteredStations" :key="station.sno" style="list-style: none; margin: 0"
                    :class="{ 'content-bg': index % 2 !== 0 }">
                    <li style="height: 30px; padding: 2% 0; ">
                        {{ station.available_rent_bikes }}
                    </li>
                </ul>
            </div>
            <div class="dockcontent" style="width: 25%;">
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
    h1{
        color: black;
    }
    .title{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 500px;
        height: 80px;
        // border: 2px solid black;
        font-size: 20px;
        font-weight: bolder;
        // border-radius: 5px;
    }
}
.ubikeImg{
    margin-right: 45px;
}

.chooseArea {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60%;
    height: 150px;
    border-top: 1px solid black;
    font-weight: bolder;
    margin: 0 auto;
    

    button {
        width: 150px;
        height: 50px;
        border: 1px solid rgb(229, 218, 218);
        border-radius: 0px 50px 50px 0px;
        position: relative;
        transition: 1s;

    }


    .tabs {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        list-style-type: none;  //讓文字前面的圓點消失
        padding: 0;
        margin: 0;
        font-size: 15px;
        word-wrap: normal

        
    }
    .tabs li {
        border-radius: 10px;
        padding: 3px 16px;
        margin: 5px 5px;
        font-size: 22px;
        cursor: pointer;
        border: 3px dashed orange;
        transition: background-color 1s;

        &:hover {
            background-color: black;
            color: aliceblue;
            border:none;
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
    background: rgb(168, 168, 168);
    height: 5px;
    border: none;
}

.nameArea {
    height: 35px;
    display: flex;
    justify-content: space-around;
    position: relative;
    margin-bottom: 15px;

    .dist {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        // width: 40px;
        // height: 25px;
        font-size: 30px;
        font-weight: bolder;
        left: 18.5%;
    }

    .stop {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        // width: 80px;
        // height: 25px;
        font-size: 30px;
        font-weight: bolder;
        left: 30%;
    }

    .rent {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        // width: 80px;
        // height: 25px;
        font-size: 30px;
        font-weight: bolder;
        margin-left: 10%;
        right: 42%;
    }

    .dock {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        // width: 100px;
        // height: 25px;
        font-size: 30px;
        font-weight: bolder;
        right: 23%;
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
        background-color: #f7e2e6;
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
    height: 50px;
    border-top: 1px solid black;
    font-size: 20px;
    margin-top: 10px;
    position: relative;

    button {
        width: 160px;
        height: 30px;
        border: 1px solid black;
        border-radius: 10px;
    }

    h5 {
        position: absolute;
        font-size: 13px;
        right: 30%;
    }

    .member {
        position: absolute;
        left: 30%;
    }

    .privacy {
        position: absolute;
        left: 40%;
    }
}
</style>