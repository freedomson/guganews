function getImageBaseColor(url){
    var img = document.getElementById('image');
    // or an URL (of your own server)
    var img = url
    
    RGBaster.colors(img, {
        success: function (payload) {
            // console.log('Dominant color:', payload.dominant);
           //  console.log('Secondary color:', payload.secondary);
           //  console.log('Palette:', payload.palette);
        }
    });
}

function bindMediaVideo(id2,id3,id4,promisein) {
    //console.log(window[id4]);
    if (typeof window[id4]!=='undefined'&&window[id4]!==false&&window[id4].length>=0){
        // console.log("bvideo loading video");
        var li=document.querySelectorAll('[name="'+id4+'"]')[0];
        li.winControl.itemDataSource=window[id4].dataSource;
        //promisein();
        li.winControl.onloadingstatechanged=
                        function(invoke){ 
                              //console.log(li.winControl);
                                //console.log(li.winControl._loadingState);
                             //   if(li.winControl._loadingState=='complete'
                              //      ){

                                    li.winControl.onloadingstatechanged=false;
                                    // console.log("bvideo2 calling promeisse");
                                      promisein();
                            //    }
                        };
    }else{
        if(window[id4]!==false){
            // console.log("bvideo3 setimeout");
            setTimeout(function(){ bindMediaVideo(id2,id3,id4) }, 1000);
        } else {
            // console.log("bvideo4 promise finel");
            promisein();
        }
    }
}

function bindMediaImage(id2,id3,id4,promisein) {

    if (typeof window[id3]!=='undefined'&&window[id3]!==false&&window[id3].length>0){
        var li=document.querySelectorAll('[name="'+id3+'"]')[0];
        // console.log(li.winControl);
        // console.log("bimage1 loading image");
        var ct=document.querySelectorAll('[name="'+id2+'"]')[0];
        ct.style.backgroundImage=window[id3].getAt(0).bgurl;  
        li.winControl.itemDataSource=window[id3].dataSource;
        li.winControl.onloadingstatechanged=
                        function(invoke){ 
                              //console.log(li.winControl);
                                //console.log(li.winControl._loadingState);
                               // if(li.winControl._loadingState=='complete'
                               //     ){
                                    li.winControl.onloadingstatechanged=false;
                                    //console.log("bimage2 calling video");
                                    promisein()
                                    //bindMediaVideo(id2,id3,id4,promisein);
                               // }
                        };
    }else{
        if(window[id3]!==false){
            // console.log("bimage3 timeout",window[id3]._binding);
            setTimeout(function(){ bindMediaImage(id2,id3,id4,promisein) }, 1000);
        } else {
            // console.log("bimage3 promise finel");
            // console.log("bimage3 timeout",window[id3]._binding);
            promisein();
        }

    }
}


function loadImageForItem(item,context){
    window[context] = new WinJS.Binding.List([]);
    context +='__'+item.id2;
    // console.log(item,context)
    processImagesForResult(item,context)
}

function processImagesForResult(item,context){

    var r=context.split("__");
    var context=r[0];
    var id2=r[1];

    var i = 0;
    var preimg = [];
    var data = [];

    item.images.map(
        function(img){
            var nitem={}
            nitem.moreResultUrl = item.url;
            nitem.idname=context+'_'+(++i);
            nitem.idname2=context+'_'+i+'_2';
            nitem.bgurl="url("+img+")";

            preimg[nitem.idname] = new Image();
            preimg[nitem.idname].src = img;
            preimg[nitem.idname].onload = function(){
                window[context].push(nitem);
            }
        }
    );
}

function imageLoadErrorEvent(imgin) {

    imgin.src="/images/windows/Square71x71Logo.scale-100.png";

}
function imageLoadEvent(imgin) {

        // console.log(imgin);
}

// +----------------------------------------------------------------------------
// | Videos
// +----------------------------------------------------------------------------
function loadVideoForItem(item,context){

        //window[id3] = new WinJS.Binding.List([]);
    window[context] = new WinJS.Binding.List([]);

    // load images per item
    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    var error= false;

    // http://gdata.youtube.com/feeds/videos?vq=eminem%20we%20made%20you&max-results=8&alt=json-in-script&callback=showMyVideos&orderby=relevance&sortorder=descending&format=5&fmt=18

    script.type= 'text/javascript';
    script.onerror = function(er){
        console.log(er);
        // spinner.stop();
        if (error) {

            return;
        }
        error=true;
        var contentDialog = document.querySelector(".win-contentdialog").winControl;
        contentDialog._dom.commands[0].addEventListener(
            'click'
            ,function(){
                // spinner.stop();
                return;
            });
        contentDialog.show();
        return;
    }
    var linkrss = encodeURIComponent(item.title);
    //var context=id;
    //     ="http://gdata.youtube.com/feeds/videos?vq=eminem%20we%20made%20you&max-results=8&alt=json&callback=showMyVideos&orderby=relevance&sortorder=descending&format=5&fmt=18";

    videofunction[context]=function(data){
        // var name = arguments.callee.caller;
        // console.log(context);
        processVideoForResult(data,context);
    };
    var finalname='videofunction.'+context;

    script.src="http://gdata.youtube.com/feeds/videos?vq="+linkrss+"&max-results=10&alt=json&callback="+finalname+"&orderby=relevance&sortorder=descending&format=6&fmt=18";
    //console.log(script.src);

    head.appendChild(script);
    
}

videofunction={};


function processVideoForResult(request,context){

    var entry=request.feed.entry;

    if (!entry) {
        window[context]=false;
        return;
    }

    var i = 0;
    
    var data = [];    

    entry.map(
        function(item){
               
            // console.log(item);
            var u = item.id.$t.split('/');
            item.video = 'http://www.youtube.com/embed/' + u[(u.length-1)];
            window[context].push(item);
            return;
            /*
            item.ourl=item.link[0].href;

            if (typeof item.ourl!=="undefined") {
                
                var r = encodeURIComponent(item.ourl);

                var re = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i
                var results = re.exec(item.content.$t);
                item.poster = results[0];

                WinJS.xhr({ url: "getyoutubeurl/?link="+r })
                    .done(function complete(result) {
                        // console.log(result.responseText);
                        item.url=result.responseText;
                        // data.push();
                        if(item.url) {
                            window[context].push(item);
                        }
                        
                });                   
            } */

        }
    );
    
    // console.log(data);
    
  
}
// Simple but unreliable function to create string hash by Sergey.Shuchkin [t] gmail.com
// alert( strhash('http://www.w3schools.com/js/default.asp') ); // 6mn6tf7st333r2q4o134o58888888888
/*
function strhash( str ) {
    if (str.length % 32 > 0) str += Array(33 - str.length % 32).join("z");
    var hash = '', bytes = [], i = j = k = a = 0, dict = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','1','2','3','4','5','6','7','8','9'];
    for (i = 0; i < str.length; i++ ) {
        ch = str.charCodeAt(i);
        bytes[j++] = (ch < 127) ? ch & 0xFF : 127;
    }
    var chunk_len = Math.ceil(bytes.length / 32);   
    for (i=0; i<bytes.length; i++) {
        j += bytes[i];
        k++;
        if ((k == chunk_len) || (i == bytes.length-1)) {
            a = Math.floor( j / k );
            if (a < 32)
                hash += '0';
            else if (a > 126)
                hash += 'z';
            else
                hash += dict[  Math.floor( (a-32) / 2.76) ];
            j = k = 0;
        }
    }
    return hash;
}
*/