(function () {

    /*
    var data = [];
    for (var i = 0; i < 100; i++) {
        data.push({ author: "Adam Smith", titleColor: "rgba(212, 14, 136, 1)", title: "Missed conversation with Michael Brown", previewText: "Michael Brown [1:53 PM]: Thanks for taking the time...", time: "1:55p" });
        data.push({ author: "Michael Brown", titleColor: "rgba(212, 14, 136, 1)", title: "Need help later", previewText: "I was hoping you could help me with...", time: "1:50p" });
        data.push({ author: "Thomas Lee", titleColor: "rgba(212, 14, 136, 1)", title: "Lunch with you", previewText: "Any chance you want to do lunch on...", time: "1:20p" });
        data.push({ author: "Michael Wilson", titleColor: "rgba(212, 14, 136, 1)", title: "QuickStart's and How To's", previewText: "More information on how to use WinJS controls", time: "1:17p" });
        data.push({ author: "Gary Paul", titleColor: "rgba(212, 14, 136, 1)", title: "Going out saturday", previewText: "Jean and I are leaving...", time: "12:28p" });
        data.push({ author: "Smith Jones", titleColor: "rgba(212, 14, 136, 1)", title: "Happend every time", previewText: "I always end up going to the ...", time: "7:12a" });
    }
    window.All = { dataSource: new WinJS.Binding.List(data).dataSource };
    */

    data = resources['Asia'];
    window.Asia = { dataSource: new WinJS.Binding.List(data).dataSource };

    data = resources['Europe'];
    window.Europe = { dataSource: new WinJS.Binding.List(data).dataSource };

    data = resources['North'];
    // data.push({ author: "Michael Wilson", titleColor: "rgba(212, 14, 136, 1)", title: "QuickStart's and How To's", previewText: "More information on how to use WinJS controls", time: "1:17p" });
    // data.push({ author: "Gary Paul", titleColor: "rgba(212, 14, 136, 1)", title: "Going out saturday", previewText: "Jean and I are leaving...", time: "12:28p" });
    // data.push({ author: "Smith Jones", titleColor: "rgba(212, 14, 136, 1)", title: "Happend every time", previewText: "I always end up going to the ...", time: "7:12a" });
    window.North = { dataSource: new WinJS.Binding.List(data).dataSource };
    
})();


WinJS.UI.processAll().then(function () {


 WinJS.Navigation.addEventListener("navigating", function (e) {

    var elem = document.getElementById("contentTarget");

    // WinJS.UI.Animation.exitPage(elem.children).then(function () {

    WinJS.Utilities.empty(elem);

    // console.log(e.detail.location);

    WinJS.UI.Pages.render(e.detail.location, elem)
    .then(function () {
            

        if (e.detail.location=="/list.html"){

            var local = e.detail.state;
            
            WinJS.Utilities.setInnerHTML(
                WinJS.Utilities.query("#appHeaderTitle")[0]
                , 'Guganews <b>'+local+'</b>');

            
        }


        var enterPage = WinJS.UI.Animation.enterPage(elem.children);

        enterPage.done(
            function(){
                // console.log(datta);
                if (e.detail.location=="/index.html"){

                    WinJS.Utilities.query(".listviewpivotitem")
                        .listen("iteminvoked", 
                            function(invoke){ 

                                // console.log(invoke.detail.itemPromise._value.data);
                                // WinJS.Navigation.navigate("/list.html");
                                getNews(invoke);

                            }, false);
                }

                if (e.detail.location=="/list.html"){

                    WinJS.Utilities.query(".listviewpivotitem")
                        .listen(
                            "iteminvoked", 
                            function(invoke){ 

                                // console.log(invoke.detail.itemPromise._value.data)
                                var clicked = invoke.detail.itemPromise._value.data;
                                // window.location=clicked.link;
                                window.open(clicked.link, "_blank", "fullscreen=yes,height=600,width=800,scrollbars=yes,resizable=no");

                                }, false);
                }

            });
    
        });

    });

    WinJS.Utilities.query(".listviewpivotitem")
    .listen(
        "iteminvoked", 
        function(invoke){ 

            getNews(invoke);

        }, false
    ); 
});

function getNews(invoke){

    console.log("Getting news!");
        // console.log(invoke.detail.itemPromise._value.data);
        // 
    /*
    h - specifies the top headlines topic
    w - specifies the world topic
    b - specifies the business topic
    n - specifies the nation topic
    t - specifies the science and technology topic
    el - specifies the elections topic
    p - specifies the politics topic
    e - specifies the entertainment topic
    s - specifies the sports topic
    m - specifies the health topic
    */
    var list=["h","w","b","n","t","el","p","e","s","m"];

    RequestDataInternal = invoke.detail.itemPromise._value.data;

    // console.log(RequestDataInternal);

    var ned = RequestDataInternal.url.substr(RequestDataInternal.url.indexOf('=')+1);
    var hl = ned.substr(0,ned.indexOf('_'));

    var requests = list.map(function(item){

        // console.log(item);

        var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');

        var topic = item;
        script.type= 'text/javascript';

        script.src= "http://ajax.googleapis.com/ajax/services/feed/load?context="+topic+"&callback=processResults&num=-1&v=1.0&q=https%3A%2F%2Fnews.google.com%2Fnews%2Ffeeds%3Fpz%3D1%26cf%3Dall%26ned%3D"+ned+"%26hl%3D"+hl+"%26topic%3D"+topic+"%26output%3Drss";
        //console.log(script.src);

        head.appendChild(script);
        if(item=='h') script.onload=function(){
            var name  = invoke.detail.itemPromise._value.data.name;
            WinJS.Navigation.navigate("/list.html",name);
        };

    });
/*
    WinJS.Promise.join(requests).done(
        function(){
        //    console.log('Done requesting');
        //console.log(invoke.detail.itemPromise._value.data);

        }
    );
  */  
}

