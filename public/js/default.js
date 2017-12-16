var sheet = (function () {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style.sheet;
})();


function addCSSRule(sheet, selector, rules, index) {
    if ("insertRule" in sheet) {
        sheet.insertRule(selector + "{" + rules + "}", index);
    } else if ("addRule" in sheet) {
        sheet.addRule(selector, rules, index);
    }
}

function spin() {

    var progressRing = document.getElementById("myProgressRing");
    var progressRingc = document.getElementById("progresscontainer");

    progressRing.style.display = 'block';
    progressRingc.style.display = 'block';

    return {
        stop: function () {
            var progressRing = document.getElementById("myProgressRing");
            var progressRingc = document.getElementById("progresscontainer");
            progressRing.style.display = 'none';
            progressRingc.style.display = 'none';
        },
        show: function () {
            var progressRing = document.getElementById("myProgressRing");
            var progressRingc = document.getElementById("progresscontainer");
            progressRing.style.display = 'block';
            progressRingc.style.display = 'block';
        }
    }
}

function isIEMobile() {
    return navigator.userAgent.match(/iemobile|windows phone|wpdesktop|wphone/i);
}

function setTheme() {

    if (isIEMobile()) {
        var hlcolor = document.createElement("div");
        hlcolor.style.color = "Highlight";
        document.body.appendChild(hlcolor);
        hlcolorrgb = window.getComputedStyle(hlcolor).color;
        currentcolor = hlcolorrgb;
    } else {
        let colors = ['orangered', 'salmon', 'tomato', 'green', 'ligthskyblue', 'violet']
        currentcolor = colors[(Math.floor((Math.random() * 6)))];
    }

    addCSSRule(document.styleSheets[0],
        ".progresscontainer", "background-color: " + currentcolor + " !important");
    
    addCSSRule(document.styleSheets[0],
        "progress", "color: " + currentcolor + " !important");
            
    addCSSRule(document.styleSheets[0],
        ".win-pivot .win-pivot-header-selected.win-pivot-header, .win-pivot-locked.win-pivot .win-pivot-header-selected.win-pivot-header", "background-image: linear-gradient(to right," + currentcolor + ",#000);");

    addCSSRule(document.styleSheets[0],
        ".mailItemImage,font[color=\"#6f6f6f\"],.bgcolor, .smallListIconTextItem a.smallListIconTextItem-Image", "background-color: " + currentcolor + " !important");

    addCSSRule(document.styleSheets[0],
        ".fontcolorselect,.fontcolor2 a, .fontcolor2 a b,a", "color: " + currentcolor + " !important");

    addCSSRule(document.styleSheets[0],
        ".morehiddenblock", "border-top:1px solid " + currentcolor + " !important");

    addCSSRule(document.styleSheets[0],
        ".morehiddenblock", "border-bottom:1px solid " + currentcolor + " !important");

    addCSSRule(document.styleSheets[0],
        ".mailItemImage", "border-bottom:3px solid " + currentcolor + " !important");

    var t = new Trianglify({
        fillOpacity: '0.5',
        strokeOpacity: '0.5',
        cellsize: '350',
        x_gradient: [currentcolor, '#000000'],
        y_gradient: [currentcolor, '#000000'],
    });

    var pattern = t.generate(document.body.clientWidth, document.body.clientHeight);
    document.body.setAttribute('style', 'background-image: ' + pattern.dataUrl);
}

/*
 _   _
| \ | | _____      _____   _ __   __ _ _ __ ___  ___ _ __
|  \| |/ _ \ \ /\ / / __| | '_ \ / _` | '__/ __|/ _ \ '__|
| |\  |  __/\ V  V /\__ \ | |_) | (_| | |  \__ \  __/ |
|_| \_|\___| \_/\_/ |___/ | .__/ \__,_|_|  |___/\___|_|
                          |_|
*/
function processResults(topic, result) {

    var id = 0;
    var i = 0;
    var max = 50;
    // var preimg=[];
    var sets=[];
    var _pods=[];
    var position = 0;
    if (typeof result.articles == 'undefined') {
        window["data_" + topic] = {
            dataSource: new WinJS.Binding.List(sets[(max)]).dataSource
        };
        return;
    }
    // console.log(result.events.results);
    data = result.articles.map(
        function (item) {
            i++
            // console.log(item)
            item.id = topic + "_" + (++id);
            item.id2 = topic + "_2_" + id;
            item.id3 = topic + "_data_img_" + item.id;
            item.id4 = topic + "_data_mp4_" + item.id;

            let publishedDate = new Date(item.publishedAt);

            // preimg[item.id] = new Image();
            // preimg[item.id].src = item.img;

            // loadImageForItem(item,item.id3);
            // loadVideoForItem(item,item.id4);

            var out={
                id              : item.id,
                id2             : item.id2,
                id3             : item.id3,
                id4             : item.id4,
                title           : item.title,
                author          : item.author,
                content         : item.description,
                url             : item.url,
                publishedDate   : publishedDate,
                images          : [(item.urlToImage ? item.urlToImage : "images/windows/Square71x71Logo.scale-100.png")],
                img             : (item.urlToImage ? item.urlToImage : "images/windows/Square71x71Logo.scale-100.png"),
                year            : publishedDate.getFullYear(),
                month           : (publishedDate.getMonth() + 1),
                day             : publishedDate.getDate(),
                monthyear       : ((publishedDate.getMonth() + 1) + "/" +  publishedDate.getFullYear())
            };
           
            _pods.push(out)
            if (i%max==0)
            {
                position = i;
                //console.log("set"+i)
                sets[i] = _pods;
                _pods=[]
                //console.log(sets[i])
            }
            return out;
        }
    );
    // console.log("data_" + topic, "datasource",data);
    if (_pods.length>0&&sets.length==0) sets[max]=_pods
    if (_pods.length>0&&sets.length!=0) {

        sets[(position+max)]=_pods 
    }
    //console.log(sets[(max)]);
    window["data_" + topic] = {
        dataSource: new WinJS.Binding.List(sets[(max)]).dataSource
    };
}

WinJS.UI.Pages.define("/list.html", {
    init: function () {},
    ready: function (element, options) {
        startupdate();
    }
});

WinJS.UI.Pages.define("/", {
    init: function () {
        setTheme();
        spinner = spin();
    },
    ready: function (element, options) {
        startupdate();
        navigator.geolocation.getCurrentPosition(show_map, spinner.stop /*errorHandler*/ );
    }
})

WinJS.UI.Pages.define("/index.html", {
    init: function () {},
    ready: function (element, options) {
        startupdate(true, true);
        // navigator.geolocation.getCurrentPosition(show_map,errorHandler);
        // 
    }
})


WinJS.Navigation.navigate("/index.html");

function myalert(e) {
   // e.preventDefault(); // <-- prevent the default action

    

    return false; // <-- alternative way to prevent the default action.
};
