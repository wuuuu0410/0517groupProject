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
          this.accessToken = data
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
          if(this.cityName === ""){
          this.apiResponse = data;
          this.filterData =data;
          }
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
  }
}

</script>

<template>
  <div>
      <div>
        <label for="cityname">你選擇的縣市：{{cityName}}</label>
        <br>
        <select name="cityname" id="cityname" v-model="cityName" required>
          <option value="Taipei">臺北市</option>
          <option value="NewTaipei">新北市</option>
          <option value="Taoyuan">桃園市</option>
          <option value="Taichung">台中市</option>
          <option value="Tainan">台南市</option>
          <option value="Kaohsiung">高雄市</option>
          <option value="Keelung">基隆市</option>
          <option value="Hsinchu">新竹縣</option>
          <option value="HsinchuCounty">新竹市</option>
          <option value="MiaoliCounty">苗栗縣</option>
          <option value="NantouCounty">南投縣</option>
          <option value="ChanghuaCounty">彰化縣</option>
          <option value="YunlinCounty">雲林縣</option>
          <option value="ChiayiCounty">嘉義縣</option>
          <option value="Chiayi">嘉義市</option>
          <option value="PingtungCounty">屏東縣</option>
          <option value="YilanCounty">宜蘭縣</option>
          <option value="HualienCounty">花蓮縣</option>
          <option value="TaitungCounty">臺東縣</option>
          <option value="PenghuCounty">澎湖縣</option>
          <option value="KinmenCounty">金門縣</option>
          <option value="LienchiangCounty">連江縣</option>
        </select>  
        <br>
        <label for="periodtime">你選擇的起始日：{{periodTime}}</label>
        <br>
        <select name="periodtime" id="periodtime" v-model="periodTime">
          <option value=90>三個月內</option>
          <option value=180>半年內</option>
          <option value=365>一年內</option>
        </select> 
      </div>
      <div>
        <label for="eventtype">你選擇的活動類型：{{eventType}}</label>
        <br>
        <input type="checkbox" name="eventype" id="eventype" value="年度活動" v-model="eventType"> 年度活動
        <input type="checkbox" name="eventype" id="eventype" value="節慶活動" v-model="eventType"> 節慶活動
        <input type="checkbox" name="eventype" id="eventype" value="藝文活動" v-model="eventType"> 藝文活動
      </div>
    <button @click="getApiResponse">搜尋</button>
    <!--this is for data test-->
      <!-- <diV> -->
        <!-- <h3>api 資料:</h3>
        <pre>{{ filterData }}</pre> -->
      <!-- </diV> -->
    <!--this is for data test-->
    <diV class="main">
      <button>往左</button>
      <div class="carts" @mouseup="cartsUpHandler" @mousedown="cartsMouseDownHandler" @mouseleave="cartsMouseLeaveHandler" @mousemove="cartsDragHandler">
        <div v-for="item in filterData" :key="item" class="cart">
          <div class="cart-title">活動名稱：<br>{{ item.ActivityName }}</div>
          <div class="cart-body">
            <p>活動描述：{{item.Description}}</p>
            <p>主辦單位：{{item.Organizer}}</p>
            <p>活動時間：{{item.StartTime.split('T')[0]}} - {{item.EndTime.split('T')[0]}}</p>
            <p v-if="item.Class1||item.Class2">活動類型：{{item.Class1}} {{item.Class2}}</p>
            <p v-else>活動類型：無</p>
          </div>
        </div>
        
      </diV>
      <button>往右</button>
    </div>
  </div>

</template>

<style scoped lang="scss">
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
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
      margin: 3rem;
      border: 1px solid black;
      background-color: rgb(255, 255, 255);
      justify-content: center;
      align-items: flex-start;
      border-radius: 2rem;
      .cart-title{
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