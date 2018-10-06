var Config = {
  name : "Portugal",
  cachefile : 1,
  cachefilename: 'gugacache.json',
  cachecoding: 'utf8',
  port : 8080,
  host : "0.0.0.0",
  apikey      : 'bd3a169f4a034fe4a5ff6f7bb114a3fc',//process.env.NAPI,
  apikeylang  : 'trnsl.1.1.20180908T231250Z.b1f43e05202df9a8.277d4aae19f2339422930efe6d50a56c5cd8ffc0', //process.env.TRANS_KEY,
  cachetimeout     :  1000*60*60*1, // 1 hours
  cachetimeoutlong :  1000*60*60*24*365, // One year
  keywords : {
    from: 'en',
    to: 'en'
  },
  newsitems : {
      pageSize: 100,
      total: 100,
      images: 5,
      location : "http://en.wikipedia.org/wiki/Portugal",
      endpoint:"/getarticle?keywords=${topic}&location=${location}&from=${from}&to=${to}&pageSize=${pageSize}"
  },
  urls: {
    events: "https://newsapi.org/v2/everything",
    translation: 'https://translate.yandex.net/api/v1.5/tr.json/translate'
  }
}

module.exports = Config;
