const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

export default {
  data() {
    return {
      token: "",
      data_f: null,
    };
  },
  methods: {
    GetAuthorizationHeader() {
      const parameter = {
        grant_type: "client_credentials",
        client_id: "t0736828-86297725-d382-4f6c",
        client_secret: "aa1815a7-f7df-4a67-8278-bfba08358586",
      };
      $.ajax({
        type: "POST",
        url: "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token",
        headers: {
          "Accept-Encoding": "br,gzip",
        },
        crossDomain: true,
        dataType: "JSON",
        data: parameter,
        async: false,
        success: function (data) {
          this.token = JSON.stringify(data);
        },
        error: function (xhr, textStatus, thrownError) {},
      });
    },
    GetApiResponse(token, cityname, top) {
      let accesstokenStr = token;
      let accesstoken = JSON.parse(accesstokenStr);

      if (accesstoken != undefined) {
        $.ajax({
          type: "GET",
          url: `https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel/${cityname}?%24top=${top}&%24format=JSON`,
          headers: {
            authorization: "Bearer " + accesstoken.access_token,
            "Accept-Encoding": "br,gzip",
          },
          async: false,
          success: function (Data) {
            this.data_f = Data;
          },
          error: function (xhr, textStatus, thrownError) {
            console.log("errorStatus:", textStatus);
            console.log("Error:", thrownError);
          },
        });
      }
    },
  },
};
