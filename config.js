var Config = {
  name : "Portugal",
  cachefile : 1,
  cachefilename: 'gugacache.json',
  cachecoding: 'utf8',
  port : 8080,
  host : "0.0.0.0",
  apikey      : process.env.NAPI,
  apikeylang  : process.env.TRANS_KEY,
  cachetimeout     :  1000*60*60*1, // 1 hours
  cachetimeoutlong :  1000*60*60*24*365, // One year
  keywords : {
    from: 'en',
    to: 'en'
  },
  newsitems : {
      pageSize: 25,
      total: 25,
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
