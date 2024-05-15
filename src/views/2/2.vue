<script>
import $ from 'jquery'
import location from '@/stores/location';
import { mapState,mapActions } from 'pinia';

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
      selected_item_index:0,
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
      let api_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/Taipei?%24top=30&%24format=JSON';
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
          this.filterData = data;
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
          if (this.periodTime !== 0) {
            this.filterData = this.filterData.filter((item) => {
              let StartTime = Date.parse(item.StartTime.split('T')[0]);
              let EndTime = Date.now()-this.periodTime*24*60*60;
              if(EndTime>StartTime){
                return true;
              }
              return false;
            })
          }
        },
        // 取得 api 資料失敗
        error: (xhr, textStatus, thrownError) => {
          console.error(textStatus, thrownError)
        }
      })
    },
    cartsMouseDownHandler(event) {
      this.isCartsMouseDown = true;
      const carts = document.querySelector('.carts');
      carts.style.cursor = 'grab';
    },
    cartsDragHandler(event) {
      const carts = document.querySelector('.carts');
      if (this.isCartsMouseDown) {
        carts.scrollLeft -= event.movementX;
        event.preventDefault();
      }
    },
    cartsUpHandler(event) {
      this.isCartsMouseDown = false;
    },
    cartsMouseLeaveHandler(event) {
      this.isCartsMouseDown = false;
      carts.style.cursor = 'default';
    },
    cartsLeftButtonMouseDownHandler(event) {
      const carts = document.querySelector('.carts');
      carts.scrollLeft -= 500;
      event.preventDefault();
    },
    cartsRightButtonMouseDownHandler(event) {
      const carts = document.querySelector('.carts');
      carts.scrollLeft += 500;
      event.preventDefault();
    },
    itemSeletedHandler(item_index){
      this.selected_item_index = item_index;
      this.selected_item_initMap();
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
    selected_item_initMap(){
      const mapElement = document.querySelector('.map-container')
      // 建立地圖
      const map = new google.maps.Map(mapElement, {
        center: { lat: this.filterData[this.selected_item_index].Position.PositionLat, lng: this.filterData[this.selected_item_index].Position.PositionLon },
        zoom: 15
      })
    }
  }
}
</script>
<template>
  <div class="background">
    <div class="cart-search">
      <div class="cart-search-periodTime">
        <label for="periodtime">選擇起始日：</label>
        <br>
        <select name="periodtime" id="periodtime" v-model="periodTime">
          <option value=90>三個月前</option>
          <option value=180>半年前</option>
          <option value=365>一年前</option>
          <option valuw=730>兩年前</option>
        </select>
      </div>
      <div class="cart-search-eventtype">
        <label for="eventtype">你選擇的活動類型：</label>
        <div>
          <input type="checkbox" name="eventype" id="eventype" value="年度活動" v-model="eventType"> 年度活動
          <input type="checkbox" name="eventype" id="eventype" value="節慶活動" v-model="eventType"> 節慶活動
          <input type="checkbox" name="eventype" id="eventype" value="藝文活動" v-model="eventType"> 藝文活動
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
      <button @mousedown="cartsLeftButtonMouseDownHandler">往左</button>
      <div class="carts" @mouseup="cartsUpHandler" @mousedown="cartsMouseDownHandler"
        @mouseleave="cartsMouseLeaveHandler" @mousemove="cartsDragHandler">
        <div v-for="item in filterData" :key="item" class="cart">
          <div class="cart-title">活動名稱：<br>{{ item.ActivityName }}</div>
          <div class="cart-body">
            <p v-if="item.Description.length >= 100">活動描述：{{ item.Description.substr(0, 101) }} ...</p>
            <p v-else>活動描述：{{ item.Description }} </p>
            <p>主辦單位：{{ item.Organizer }}</p>
            <p>活動時間：{{ item.StartTime.split('T')[0] }} - {{ item.EndTime.split('T')[0] }}</p>
            <p v-if="item.Class1 || item.Class2">活動類型：{{ item.Class1 }} {{ item.Class2 }}</p>
            <p v-else>活動類型：無</p>
            <a href="#sidebar" @click="itemSeletedHandler(filterData.indexOf(item))">詳細資訊</a>
          </div>
        </div>

      </div>
      <button @mousedown="cartsRightButtonMouseDownHandler">往右</button>
    </div>
  </div>
  <div class="container">
    <div class="sidebar" id="sidebar">
      <div v-if="filterData" class="sidebar-main">
        <h1>活動名稱：</h1>
        <h1>{{ filterData[selected_item_index].ActivityName }}</h1>
        <h1>活動描述：</h1>
        <p class="sidebar-body">{{ filterData[selected_item_index].Description }}</p>
        <h1>主辦單位：</h1>
        <p>{{ filterData[selected_item_index].Organizer }}</p>
        <h1>活動照片：</h1>
        <img v-if="filterData[selected_item_index].Picture.PictureUrl1" :src="filterData[selected_item_index].Picture.PictureUrl1">
        <p v-else>無</p>
        <h1>官網：</h1>
        <a v-if="filterData[selected_item_index].WebsiteUrl" :href="filterData[selected_item_index].WebsiteUrl">{{filterData[selected_item_index].WebsiteUrl}}</a>
        <p v-else>無</p>
      </div>
      <div v-else>近期無活動可顯示</div>
    </div>
    <!-- 地圖 -->
    <div class="map-wrapper">
      <div id="map" class="map-container"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
//設定整個容器的樣式
.background {
  background: url(https://www.finalfantasyxiv.com/freetrial/static/eb21a694cb608a7dd2a52fede01db68f/c69a4/texture.png);
  }

.container {
  display: flex;
  height: 120vh;
}

//設定左側欄位的樣式
.sidebar {
  width: 400px;
  padding: 20px;
  background: url(https://www.finalfantasyxiv.com/freetrial/static/eb21a694cb608a7dd2a52fede01db68f/c69a4/texture.png) rgba(60, 60, 60, 0.146);
  .sidebar-main{
      *{
        margin: 1.2rem;
      }
      p{
        font-size: 1.2rem;
      }
      h1{
        font-weight: bold;
        font-size: 1.5rem;
      }
      .sidebar-body{
        height: 30vh;
        overflow-y: scroll;
        background-color: white;
        padding: 1rem;
        border: 1px solid black;
      }
      img{
        width: 60%;
      }
      a{
          text-align: center;
          font-size: 1.2rem;
          color: blue;
          text-decoration: underline;
              
        }
    }
}

//將地圖容器包裝在一個 .map-wrapper 容器中,並使用 flex: 1 佔滿剩餘空間。
.map-wrapper {
  flex: 1;
}

//設定地圖的高度和寬度
.map-container {
  height: 100%;
  width: 100%;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.cart-search {
  display: flex;
  margin: 2rem;
  font-size: 2rem;
  border: 1px solid black;
  border-radius: 2rem;
  flex-wrap: wrap;
  align-items: center;

  * {
    margin: 2rem;
  }

  .cart-search-cityname,
  .cart-search-periodTime {
    flex: 1 1 300px;

    select {
      width: 100%;
      height: 5vh;
      font-size: 2rem;
    }
  }

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
    height: 10vh;
    font-size: 2rem;
  }
}

.main {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1rem;

  button {
    padding: 2rem;
    min-height: 10vh;
    font-size: 1rem;
    text-align: center;
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
      border: 1px solid black;
      background-color: rgb(255, 255, 255);
      align-items: flex-start;
      border-radius: 2rem;

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
        a{
          text-align: center;
          font-size: 2rem;
          color: blue;
          text-decoration: underline;
          
        }
      }

    }
  }
}
</style>