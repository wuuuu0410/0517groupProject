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
    }
  },
  // 建立生命週期函式
  mounted() {
    this.getAuthorizationHeader()
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
          this.getApiResponse()
        },
        // 取得 access_token 失敗
        error: (xhr, textStatus, thrownError) => {
          console.error(thrownError)
        }
      })
    },
    // 取得 api 資料
    getApiResponse() {
      const api_url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24top=30&%24format=JSON'

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
          this.apiResponse = data
        },
        // 取得 api 資料失敗
        error: (xhr, textStatus, thrownError) => {
          console.error(textStatus, thrownError)
        }
      })
    }
  }
}

</script>

<template>
  <div>
      <div>
        <label for="cityname">你選擇的縣市：{{cityName}}</label>
        <select name="cityname" id="cityname" v-model="cityName" required>
          <option>請選擇</option>
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
      </div>
      <div>
        <input type="checkbox" name="" id=""> 年度活動
        <input type="checkbox" name="" id=""> 節慶活動
        <input type="checkbox" name="" id=""> 藝文活動
      </div>
    <button>搜尋</button>
    <!--this is for data test-->
      <!-- <diV> -->
        <h3>api 資料:</h3>
        <pre>{{ apiResponse }}</pre>
      <!-- </diV> -->
    <!--this is for data test-->
    <div v-for="item in apiResponse" :key="item">
      <h1>活動名稱：{{ item.ActivityName }}</h1>
      <p>活動描述：{{item.Description}}</p>
      <p>主辦單位：{{item.Organizer}}</p>
      <p>活動時間：{{item.StartTime.split('T')[0]}} - {{item.EndTime.split('T')[0]}}</p>
      <div>
      <p v-if="item.Class1 !== ''">活動類型：{{item.Class1}}</p>
    </div>
    </div>
  </div>

</template>

<style></style>