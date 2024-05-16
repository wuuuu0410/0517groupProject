<script>
import location from '@/stores/location';
import { mapState,mapActions } from 'pinia';
import $ from 'jquery'
import Swal from 'sweetalert2'

export default {
  name: 'App',
  data() {
    return {
      accessToken: null,
      apiResponse: null,
      filterData: null,
      cityName: "",
      periodTime: 0,
      perPage: 30,
      eventType: [],
      isCartsMouseDown: false,
      selected_item_index: 0,
      marker: null,
    }
  },
  // 建立生命週期函式
  mounted() {
    this.setPage(2);
    this.getAuthorizationHeader();
    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDqHRDB5XqddRHK-DS70urhILDlgv4kHMs&libraries=places&callback=initMap'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
    window.initMap = this.initMap
  },
  computed:{
    ...mapState(location,["page","pageInfo"]),
  },
  methods: {
    ...mapActions(location,["setPage"]),
    // 取得 Authorization Header
    getAuthorizationHeader() {
      const parameter = {
        grant_type: "client_credentials",
        client_id: "22422176jj-99cd228d-2c94-4381",
        client_secret: "823b2cc2-11d5-48b1-ad3c-5a7b2633f28e"
      }
      // 取得 access_token
      const auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token"
      // 發送請求
      $.ajax({
        type: "POST",
        url: auth_url,
        headers: {
          "Accept-Encoding": "br,gzip",
        },
        // 設定跨域
        crossDomain: true,
        dataType: 'JSON',
        data: parameter,
        async: false,
        success: (data) => {
          this.accessToken = data;
          this.getApiResponse();
        },
        // 取得 access_token 失敗
        error: (xhr, textStatus, thrownError) => {
          console.error(thrownError)
        }
      })
    },
    // 取得 api 資料
    getApiResponse() {
      let api_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/Taipei?%24top=200&%24format=JSON';
      $.ajax({
        // 設定請求
        type: 'GET',
        url: api_url,
        headers: {
          "Authorization": `Bearer ${this.accessToken.access_token}`,
          "Accept-Encoding": "br,gzip",
        },
        // 設定跨域
        async: false,
        success: (data) => {
          this.apiResponse = data;
          // this.filterData = data;
          if (this.eventType.length !== 0) {
            this.filterData = this.apiResponse.filter((item) => {
              for (let n of this.eventType) {
                if (item.Class1 == n || item.Class2 == n) {
                  return true;
                }
              }
              return false;
            })
          }
          // 如果有城市名稱，篩選出該城市的活動
          if (this.periodTime !== 0) {
            const specifiedTimeInPast = Date.now() - Math.abs(this.periodTime) * 24 * 60 * 60 * 1000;

            this.filterData = this.filterData.filter((item) => {
              const startTime = Date.parse(item.StartTime.split('T')[0]);

              if (this.periodTime === -1) {
                return startTime > Date.now();
              } else {
                return startTime > specifiedTimeInPast;
              }
            });

            // 檢查結果數量
            if (this.filterData.length == 0) {
              // alert('沒有符合條件的活動');
              this.filterData = null;
              Swal.fire({
                title: "沒有符合條件的活動",
                text: "請在時間範圍內重新搜尋",
                icon: "warning"
              });
            }
          }
        },
        // 取得 api 資料失敗
        error: (xhr, textStatus, thrownError) => {
          console.error(textStatus, thrownError)
        }
      })
    },
    // 滑鼠按下
    cartsMouseDownHandler(event) {
      this.isCartsMouseDown = true;
      const carts = document.querySelector('.carts');
      carts.style.cursor = 'grab';
    },
    // 移動滑鼠
    cartsDragHandler(event) {
      const carts = document.querySelector('.carts');
      if (this.isCartsMouseDown) {
        carts.scrollLeft -= event.movementX;
        event.preventDefault();
      }
    },
    // 放開滑鼠
    cartsUpHandler(event) {
      this.isCartsMouseDown = false;
    },
    // 移動滑鼠離開
    cartsMouseLeaveHandler(event) {
      this.isCartsMouseDown = false;
      carts.style.cursor = 'default';
    },
    // 左鍵按鈕
    cartsLeftButtonMouseDownHandler(event) {
      const carts = document.querySelector('.carts');
      carts.scrollLeft -= 500;
      event.preventDefault();
    },
    // 右鍵按鈕
    cartsRightButtonMouseDownHandler(event) {
      const carts = document.querySelector('.carts');
      carts.scrollLeft += 500;
      event.preventDefault();
    },
    selected_item_initMap() {
      const mapElement = document.querySelector('.map-container')
      // 建立地圖
      this.map = new google.maps.Map(mapElement, {
        // 中心點
        center: { lat: this.filterData[this.selected_item_index].Position.PositionLat, lng: this.filterData[this.selected_item_index].Position.PositionLon },
        // 地圖縮放層級
        zoom: 17
      })
    },
    // 點擊活動卡片後，顯示活動資訊並初始化地圖
    itemSelectedHandler(itemIndex) {
      // 將目前選取的活動索引存入selected_item_index
      this.selected_item_index = itemIndex;
      // 顯示活動資訊
      this.selected_item_initMap();

      // 如果已存在marker,先將其從地圖上移除
      if (this.marker) {
        this.marker.setMap(null);
      }

      // 創建新的marker
      this.marker = new google.maps.Marker({
        position: {
          lat: this.filterData[itemIndex].Position.PositionLat,
          lng: this.filterData[itemIndex].Position.PositionLon
        },
        // 將marker添加到已創建的地圖上
        map: this.map,
        // 設定marker的標題
        title: this.filterData[itemIndex].ActivityName
      });
    },
    //============
    initMap() {
      // 建立地圖物件
      const mapElement = document.querySelector('.map-container')
      // 建立地圖
      const map = new google.maps.Map(mapElement, {
        center: { lat: 25.041160583496094, lng: 121.55579376220703 },
        zoom: 15
      })
      // 建立搜尋框
      // const input = document.getElementById('searchInput')
      // // 建立自動完成物件
      // const autocomplete = new google.maps.places.Autocomplete(input)
      // // 將搜尋結果顯示在地圖上
      // const marker = new google.maps.Marker({ map: map })
      // // autocomplete.bindTo('bounds', map)
    },
    // 點擊活動卡片後，顯示活動資訊並初始化地圖
  }
}
</script>
<template>
  <transition-group name="list" tag="div" class="app">
    <div class="background">
      <div class="cart-search">
        <div class="cart-search-periodTime">
          <label for="periodtime">選擇時間範圍：</label>
          <br>
          <select name="periodtime" id="periodtime" v-model="periodTime" style="border-radius: 5px; padding: 0.5rem; border: 1px solid #ccc;">
            <option value="-1">即將到來的活動</option>
            <option value=90>最近三個月內</option>
            <option value=180>最近六個月內</option>
            <option value=365>最近一年內</option>
            <option valuw=730>最近兩年內</option>
          </select>
        </div>
        <div class="cart-search-eventtype">
          <label for="eventtype">你選擇的活動類型：</label>
          <div>
            <input type="checkbox" name="eventype" id="eventype" value="藝文活動" v-model="eventType" style="cursor: pointer;
            "> 藝文活動
            <input type="checkbox" name="eventype" id="eventype" value="節慶活動" v-model="eventType" style="cursor: pointer;
            "> 節慶活動
            <input type="checkbox" name="eventype" id="eventype" value="年度活動" v-model="eventType" style="cursor: pointer;
            "> 年度活動
          </div>
        </div>
        <button @click="getApiResponse">搜尋</button>
      </div>
      <!--this is for data test-->
      <!-- <diV>
      <h3>api 資料:</h3>
      <pre>{{ filterData }}</pre>
    </diV> -->
      <!--this is for data test-->
      <div class="main">
        <!-- 左右按鈕 -->
        <button v-if="filterData" @mousedown="cartsLeftButtonMouseDownHandler" class="left-right-button">往左</button>
        <!-- 活動卡片 -->
        <transition name="fade" mode="out-in">
          <transition-group name="list" tag="div" class="carts" @mouseup="cartsUpHandler"
            @mousedown="cartsMouseDownHandler" @mouseleave="cartsMouseLeaveHandler" @mousemove="cartsDragHandler">
            <!-- 使用 v-for 指令，遍歷 filterData 陣列，產生活動卡片 -->
            <div v-for="item in filterData" :key="item" class="cart">
              <!-- 活動卡片標題 -->
              <div class="cart-title">{{ item.ActivityName }}</div>
              <!-- 活動卡片內容 -->
              <div class="cart-body">
                <p v-if="item.Description.length >= 100">活動描述：{{ item.Description.substr(0, 101) }} ...</p>
                <p v-else>活動描述：{{ item.Description }} </p>
                <p>主辦單位：{{ item.Organizer }}</p>
                <p>活動時間：{{ item.StartTime.split('T')[0] }} - {{ item.EndTime.split('T')[0] }}</p>
                <p v-if="item.Class1 || item.Class2">活動類型：{{ item.Class1 }} {{ item.Class2 }}</p>
                <p v-else>活動類型：無</p>
                <a href="#sidebar" @click="itemSelectedHandler(filterData.indexOf(item))">詳細資訊</a>
              </div>
            </div>

          </transition-group>
        </transition>
        <button v-if="filterData" @mousedown="cartsRightButtonMouseDownHandler" class="left-right-button">往右</button>
      </div>
    </div>
    <div class="container">
      <div class="sidebar" id="sidebar">
        <div v-if="filterData" class="sidebar-main">
          <!-- <h1>活動名稱：</h1> -->
          <h1 style="font-size: 36px;color: #333333;font-weight: bold;;">{{ filterData[selected_item_index].ActivityName
            }}</h1>
          <h1>活動描述：</h1>
          <p class="sidebar-body" style="font-size: 20px;">{{ filterData[selected_item_index].Description }}</p>
          <h1>主辦單位：</h1>
          <p>{{ filterData[selected_item_index].Organizer }}</p>
          <h1>活動照片：</h1>
          <img v-if="filterData[selected_item_index].Picture.PictureUrl1"
            :src="filterData[selected_item_index].Picture.PictureUrl1">
          <p v-else>無</p>
          <h1>官網：</h1>
          <a v-if="filterData[selected_item_index].WebsiteUrl" :href="filterData[selected_item_index].WebsiteUrl">{{
            filterData[selected_item_index].WebsiteUrl }}</a>
          <p v-else>無</p>
        </div>
        <div v-else
          style="font-size: 30px; text-align: center; margin-top: 15rem;border: 1px solid black;padding: 1rem;border-radius: 2px;background-color: #f2f2f2;box-shadow: 0px 4px 6px 4px rgba(0, 0, 0, 0.2) ; color: #333333; ">
          近期無活動可顯示</div>
      </div>
      <!-- 地圖 -->
      <div class="map-wrapper">
        <div id="map" class="map-container"></div>
      </div>
    </div>
  </transition-group>
</template>

<style scoped lang="scss">
//設定整個容器的樣式
.background {
  background: url(https://www.finalfantasyxiv.com/freetrial/static/eb21a694cb608a7dd2a52fede01db68f/c69a4/texture.png);
}


// 設定活動搜尋欄位的樣式
.cart-search {
  display: flex;
  margin: 2rem;
  font-size: 2rem;
  // border: 2px solid black;
  border-radius: 2rem;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 0px 4px 6px 4px rgba(0, 0, 0, 0.2);

  * {
    margin: 2rem;
  }

  // 設定城市名稱的選單
  .cart-search-cityname,
  .cart-search-periodTime {
    flex: 1 1 300px;

    select {
      width: 100%;
      height: 5vh;
      font-size: 1.5rem;
    }
  }

  // 設定活動類型的選單
  .cart-search-eventtype {
    flex: 2 1 500px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;

    div {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      input {
        width: 3vh;
        height: 3vh;
      }
    }
  }

  button {
    flex: 0.5 0.5 80px;
    height: 8vh;
    font-size: 2rem;
    border-radius: 8px;
    background: linear-gradient(to bottom, #ffffff, #f2f2f2);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border: 1px solid #c9c9c9;
    color: #1c1c1c;
    transition: background-color 0.3s, transform 0.05s, box-shadow 0.3s, color 0.3s;

    &:hover {
      background: linear-gradient(to bottom, #ffffff, #e5e5e5);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      color: rgb(45, 45, 45);
      cursor: pointer;
    }

    &:active {
      transform: scale(0.95);
      box-shadow: none;
      animation: coolAnimation 0.5s infinite alternate;
    }

    &::before {
      margin-right: 5px;
    }
  }

  @keyframes coolAnimation {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(0.9);
    }
  }
}

// 設定活動卡片的樣式
.main {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1rem;

  .left-right-button {
    padding: 0.6em 1em;
    border: none;
    outline: none;
    color: rgb(0, 0, 0);
    background: #111;
    cursor: pointer;
    position: relative;
    z-index: 0;
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
    font-size: 1.3rem;

    &:hover {
      scale: 1.1;
    }

    &:active {
      transform: scale(0.95);
      box-shadow: none;
    }
  }

  .left-right-button:before {
    content: "";
    background: linear-gradient(45deg,
        #ff0000,
        #ff7300,
        #fffb00,
        #48ff00,
        #00ffd5,
        #002bff,
        #7a00ff,
        #ff00c8,
        #ff0000);
    /* 設定漸變背景 */
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    -webkit-filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing-left-right-button 20s linear infinite;
    transition: opacity 0.3s ease-in-out;
    border-radius: 10px;
  }

  @keyframes glowing-left-right-button {
    0% {
      background-position: 0 0;
    }

    50% {
      background-position: 400% 0;
    }

    100% {
      background-position: 0 0;
    }
  }

  .left-right-button:after {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: #eaeaea;
    left: 0;
    top: 0;
    border-radius: 10px;
  }


  .carts {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    scroll-behavior: smooth;
    flex-wrap: nowrap;
    margin: 2rem;
    align-items: center;

    &:hover {
      cursor: grab;
    }

    .cart {
      display: flex;
      flex-direction: column;
      min-width: 700px;
      height: 900px;
      padding: 0.5rem;
      margin: 1rem;
      background-color: rgb(255, 255, 255);
      align-items: flex-start;
      border-radius: 2rem;
      box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease-in-out;
      background: url(https://www.finalfantasyxiv.com/freetrial/static/eb21a694cb608a7dd2a52fede01db68f/c69a4/texture.png) rgba(107, 106, 115, 0.08);
      margin-bottom: 2rem;

      &:hover {
        cursor: pointer;
        background-color: rgb(240, 240, 240);
        scale: 1.015;
        box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.439);
      }

      &:active {
        background-color: rgb(220, 220, 220);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        scale: 0.985;
      }

      .cart-title {
        margin-top: 3rem;
        display: flex;
        font-size: 2rem;
        font-weight: bold;
        padding-left: 2rem;
      }

      .cart-body {
        margin-top: 2rem;
        overflow: visible;
        display: flex;
        flex-direction: column;

        p {
          margin: 1rem;
          padding: 0.5rem;
          font-size: 1.5rem;
        }

        a {
          text-align: center;
          font-size: 2rem;
          color: rgb(106, 106, 233);
          text-decoration: underline;
          font-size: bold;
        }
      }

    }
  }
}

.container {
  display: flex;
  height: 100vh;
  flex-wrap: wrap;

  //設定左側欄位的樣式
  .sidebar {
    flex: 1 1 500px;
    padding: 20px;
    background: url(https://www.finalfantasyxiv.com/freetrial/static/eb21a694cb608a7dd2a52fede01db68f/c69a4/texture.png) rgba(60, 60, 60, 0.146);
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    .sidebar-main {
      * {
        margin: 1.2rem;
        border-radius: 5px;
      }

      p {
        font-size: 1.2rem;
      }

      h1 {
        font-weight: bold;
        font-size: 1.5rem;
      }

      .sidebar-body {
        height: 35vh;
        overflow-y: scroll;
        background-color: white;
        padding: 1rem;
        border: 1px solid black;
      }

      img {
        width: 60%;
      }

      a {
        text-align: center;
        font-size: 1.2rem;
        color: blue;
        text-decoration: underline;

      }
    }
  }

  //將地圖容器包裝在一個 .map-wrapper 容器中,並使用 flex: 1 佔滿剩餘空間。
  .map-wrapper {
    flex: 2 1 500px;

    .map-container {
      height: 100%;
      box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.2);
    }
  }

  //設定地圖的高度和寬度

}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter,
.list-leave-to

/* .list-move */
  {
  opacity: 0;
  transform: translateY(30px);
}
</style>