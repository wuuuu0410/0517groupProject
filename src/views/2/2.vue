<script>
import $ from 'jquery'

export default {
  name: 'App',
  data() {
    return {
      accessToken: null,
      apiResponse: null
    }
  },
  // 建立生命週期函式
  mounted() {
    this.getAuthorizationHeader()
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
    },
    //============
    initMap() {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 25.041160583496094, lng: 121.55579376220703 },
        zoom: 15
      })

      const input = document.getElementById('searchInput')
      const autocomplete = new google.maps.places.Autocomplete(input)
      autocomplete.bindTo('bounds', map)
    }
  }
}


</script>

<template>
  <!-- <div>
    <h3>取得憑證資料:</h3>
    <pre>{{ accessToken }}</pre>

    <h3>api 資料:</h3>
    <pre>{{ apiResponse }}</pre>
  </div> -->

  <div id="map" style="height: 500px; width: 100%;"></div>

</template>

<style scoped lang="scss"></style>