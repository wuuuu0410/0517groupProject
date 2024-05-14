<script>
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
    methods: {
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
        filteredStations() {
            return this.stations.filter(station => station.sarea === this.selectedArea);
        }
    }
};
</script>


<template>
    <div>
        <div class="header">
            <img src="https://www.youbike.com.tw/region/assets/images/logo.svg" alt="">

        </div>
        <div class="stopList">
            <h1>站點列表</h1>
        </div>
        <div class="chooseArea">
            <!-- <button type="button">
                <p class="ubike">Ubike2.0</p>
            </button> -->

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
                <P>可停空位</P>
            </div> 

        </div>
        <div class="bigArea">
    <div class="content">
        <div :class="{ 'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }" v-for="(station, index) in filteredStations" :key="station.sno">
            <ul style="list-style: none; display: flex;">
                <li>{{ station.sarea }}</li>
                <li>{{ formatStationName(station.sna) }}</li>
                <li>{{ station.available_rent_bikes }}</li>
                <li>{{ station.available_return_bikes }}</li>
            </ul>
        </div>
    </div>
</div>  


        <div class="footer">
            <button type="button">聯絡我們</button>
            <h5>Copyright © 2024 YouBike Co., Ltd v2.23.0</h5>
        </div>
    </div>
</template>




<style scoped lang="scss">
.header {
    width: 100%;
    height: 100px;
    border: 1px solid black;

    img {
        width: 100px;
        height: 100px;
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
        left: 17%;
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
        left: 35%;
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
        right: 30%;
    }

    .dock {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 80px;
        height: 25px;
        font-size: 20px;
        font-weight: bolder;
        right: 15%;
    }

}



.bigArea {
    margin:0 10%;
    width: 80%;
    height: 500px;
    border: 1px solid black;


    .content {
        // display: flex;
        // flex-direction: column;
        // justify-content: space-around;
        width: 100%;
        height: 500px;
        border: 1px solid black;
        overflow-y: auto;
    
}
}

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

    button {
        width: 80px;
        height: 30px;
        border: 1px solid black;
        border-radius: 10px;
    }
}

</style>