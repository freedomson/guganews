var requestOut = require('request');
var Config = require('../config.js');
var cache = require('memory-cache');
var fs = require('fs');

if (Config.cachefile) {
    fs.readFile(Config.cachefilename, Config.cachecoding, function (err,data) {
        if (err) {
            console.log('Error', err);
        } else {
            var sizecache = cache.importJson(data)
            console.log("Cache size",sizecache);
        }
      });
}

var processed = 0;
function getArticle() {}
getArticle.prototype.get = function (request, response) {

    response.writeHead(200, {"Content-Type": "application/json"}); 

    var name = request.get.name || Config.keywords.name
    var to = request.get.to || Config.keywords.to
    var from = request.get.from || Config.keywords.from
    var location = request.get.location || Config.newsitems.location
    var pageSize = request.get.pageSize || Config.newsitems.pageSize
    var hash = request.get.keywords+location
    var cached = cache.get(hash);

    if (cached) {
        console.log("Art from cache!", hash);
        var err = JSON.stringify(cached).indexOf("404 - File or directory not found.")==-1 ? false : true;
        if (!err) {
            console.log('cached',hash);
            response.end(cached);
            return;
        } else {
            console.log('DELETE',hash);
            cache.clear(); // CACHE ERROR FORCE CLEAN
            response.end(JSON.stringify({success:false}));
            return;
        }
    }

    console.log('Fetching...',hash);

    let topics = request.get.keywords.split(',')

    topics.forEach((topic)=>{
        getArticle.prototype.translate(hash, topic, topics, from, to, location, name, pageSize, response)
    })
}

getArticle.prototype.articleprocessor = function(hashin, keywords, location, name, to, pageSize, response){

    var keywords = keywords ? keywords : [name]

    var availableLangs=['ar','en','cn','de','es','fr','he','it','nl','no','pt','ru','se','sv','ud','zh']
    var availablecountries=['ae','ar','at','au','be','bg','br','ca','ch','cn','co','cu','cz','de','eg','fr','gb','gr','hk','hu','id','ie','il','in','it','jp','kr','lt','lv','ma','mx','my','ng','nl','no','nz','ph','pl','pt','ro','rs','ru','sa','se','sg','si','sk','th','tr','tw','ua','us','ve','za']
    var setup = {
        url: Config.urls.events,
        qs: {
            "q":"("+keywords.join(' OR ')+")",
            "language":(availableLangs.find(l=>l==to))?to:Config.keywords.to,
            "sortBy":"publishedAt",
            "from": new Date(Date.now() - 86400000*5).toISOString(), // 5 days ago
            "apiKey":Config.apikey,
            "pageSize":pageSize
        }
    };

    var out = requestOut.get(
        setup,
        function (error, responsein, body) {
            cache.put(hashin, body, Config.cachetimeout);
            if (Config.cachefile) {
                fs.writeFile(Config.cachefilename, cache.exportJson(), Config.cachecoding, function (err,data) {
                    if (err) {
                      return console.log('error',err);
                    }
                    console.log('Cache written', Config.cachefilename);
                  });
            }
            response.end(body);
        });
}

getArticle.prototype.translateprocessor = function(hashin, topics, value, location, name, to, pageSize, response){

    var hash = hashin+topics.length
    var hashdata = hashin+topics.length+1

    var cached = cache.get(hash);
    var cacheddata = cache.get(hashdata);

    if (cached) {
        cache.put(hash, ++cached);
        //console.log("caching",cached,value.text);
        try {
            cache.put(hashdata, cacheddata.concat(value.text[0]));
        } catch(e){
            console.log('failed',hashdata)
        }

    } else {
        cache.put(hash, cached=1);
        // console.log("caching",topics,value);
        try {
            cache.put(hashdata, [(value.text[0])]);
        } catch(e) {
            cache.put(hashdata,0);
        } finally {
            console.log("popcorn")
        }
        
    }

    cacheddata = cache.get(hashdata);
    getArticle.prototype.articleprocessor(hashin, cacheddata, location, name, to, pageSize, response)

}

getArticle.prototype.translate = function (hashin, topic, topics, from, to, location, name, pageSize, response) {
    var hash=topic+from+to
    var cached=cache.get(hash);
    if (cached) {
        console.log("Translate from cache!", cached);
        getArticle.prototype.translateprocessor(hashin, topics, cached, location, name, to, pageSize, response)
        return cached;
    }
    var transreq={
        url: Config.urls.translation,
        qs: {
            "key": Config.apikeylang,
            "text": topic,
            "lang": from+"-"+to
        }
    }
    var out = requestOut.get(transreq, 
        function (error, responsein, body) {
            try {
                jbody = JSON.parse(body);
            } catch(e){
                console.log("Response error", error, responsein, body);
                jbody = {}
            }
            console.log('translateprocessor call')
            getArticle.prototype.translateprocessor(hashin, topics, jbody, location, name, to,  pageSize, response)
            cache.put(hash, jbody); 
            return jbody;
        });
}


module.exports = getArticle;