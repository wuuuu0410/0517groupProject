<script>
import $ from 'jquery'

export default {
  name: 'App',
  data() {
    return {
      accessToken: null,
      apiResponse: null,
      filterData:null,
      cityName:"",
      periodTime:0,
      perPage:30,
      eventType:[],
      isCartsMouseDown:false,
    }
  },
  // 建立生命週期函式
  mounted() {
    this.getAuthorizationHeader();
    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDqHRDB5XqddRHK-DS70urhILDlgv4kHMs&libraries=places&callback=initMap'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
    window.initMap = this.initMap
  },
  methods: {
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
      let api_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24top=30&%24format=JSON';
      if(this.cityName !== ""){
        api_url=`https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/${this.cityName}?%24top=${this.perPage}&%24format=JSON`;
      }
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
          this.filterData =data;
          if(this.eventType.length !==0){
            this.filterData=this.apiResponse.filter((item)=>{
              for(let n of this.eventType){
                if(item.Class1 == n || item.Class2 == n){
                  return true;
                }
              }
              return false;
            })
          }
          if(this.periodTime !==0){
            this.filterData=this.filterData.filter((item)=>{
              let StartTime = new Date(item.StartTime);
              console(StartTime);
              return true;
            })
          }
        },
        // 取得 api 資料失敗
        error: (xhr, textStatus, thrownError) => {
          console.error(textStatus, thrownError)
        }
      })
    },
    cartsMouseDownHandler(event){
      this.isCartsMouseDown =true;
      const carts = document.querySelector('.carts');
      carts.style.cursor = 'grab';
    },
    cartsDragHandler(event){
      const carts = document.querySelector('.carts');
      if(this.isCartsMouseDown){
      carts.scrollLeft -=event.movementX;
      event.preventDefault();
      }
    },
    cartsUpHandler(event){
      this.isCartsMouseDown=false;
    },
    cartsMouseLeaveHandler(event){
      this.isCartsMouseDown =false;
    }, 
    cartsLeftButtonMouseDownHandler(event){
      this.isCartsMouseDown =true;
      const carts = document.querySelector('.carts');
      carts.scrollLeft -= 500;
      event.preventDefault();
    },
    cartsRightButtonMouseDownHandler(event){
      this.isCartsMouseDown =true;
      const carts = document.querySelector('.carts');
      carts.scrollLeft += 500;
      event.preventDefault();
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
    }
  }
}


</script>

<template>
  <div class="container">
    <div class="sidebar">
      <!-- <h3>取得憑證資料:</h3>
      <pre>{{ accessToken }}</pre>
      <h3>api 資料:</h3>
      <pre>{{ apiResponse }}</pre> -->
      <div class="testArea">
        <h1>Test</h1>
      </div>
    </div>
    <!-- 地圖 -->
    <div class="map-wrapper">
      <div id="map" class="map-container"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
//設定整個容器的樣式
.container {
  display: flex;
  height: 100vh;
}

//設定左側欄位的樣式
.sidebar {
  width: 300px;
  padding: 20px;
  background-color: #f0f0f0;
}

.testArea {
  background-color: #ffffff;
  height: 300px;
  border: 1px solid rgb(0, 0, 0);
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
</style>
<style scoped lang="scss">
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.cart-search{
  display: flex;
  margin: 2rem;
  font-size: 2rem;
  border: 1px solid black;
  border-radius: 2rem;
  flex-wrap: wrap;
  align-items: center;
  *{
    margin: 2rem;
  }
  .cart-search-cityname,.cart-search-periodTime{
    flex: 1 1 300px;
    select{
      width: 100%;
      height: 5vh;
      font-size: 2rem;
    }
  }
  .cart-search-eventtype{
    flex: 2 1 500px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    div{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      input{
        width: 3vh;
        height: 3vh;
      }
    }
  }
  button{
    flex: 0.5 0.5 80px;
    height: 10vh;
    font-size: 2rem;
  }
}
.main{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  button{
      padding: 2rem;
      min-height: 10vh;
      font-size: 1rem;
      text-align: center;
    }
  .carts{
      display: flex;
      flex-direction: row;
      overflow-x: scroll;
      scroll-behavior: smooth;
      flex-wrap: nowrap;
      margin: 2rem;
      align-items: center;
      &:hover{
        cursor: grab;
      }
      
    .cart{
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
      .cart-title{
        margin-top: 3rem;
        display:flex;
        font-size: 2rem;
        font-weight: bold;
        padding-left: 2rem;
      }
      .cart-body{
        margin-top: 2rem;
        overflow:visible;
        p{
          margin: 1.5rem;
          padding: 0.5rem;
          font-size: 1.5rem;
        }
      }
      
    }
  }
}
</style>