/*
_                    _                         _        _
| |    ___   __ _  __| |   ___ ___  _   _ _ __ | |_ _ __(_) ___  ___
| |   / _ \ / _` |/ _` |  / __/ _ \| | | | '_ \| __| '__| |/ _ \/ __|
| |__| (_) | (_| | (_| | | (_| (_) | |_| | | | | |_| |  | |  __/\__ \
|_____\___/ \__,_|\__,_|  \___\___/ \__,_|_| |_|\__|_|  |_|\___||___/
*/
(function () {
    data = resources['Asia'];
    window.Asia = {
        dataSource: new WinJS.Binding.List(data).dataSource
    };

    data = resources['Europe'];
    window.Europe = {
        dataSource: new WinJS.Binding.List(data).dataSource
    };

    data = resources['North'];
    window.North = {
        dataSource: new WinJS.Binding.List(data).dataSource
    };
})();

// Config starter ...
var page = 0; // index.html

WinJS.UI.processAll().then(function () {

    WinJS.Navigation.addEventListener("beforenavigate", function (e) {
        if (boxopen) {
            e.detail.setPromise(WinJS.Promise.wrap(true));
            // spinn.stop();
        }
    });

    WinJS.Navigation.addEventListener("navigating", function (e) {
        var elem = document.getElementById("contentTarget");
        WinJS.Utilities.empty(elem);
        WinJS.UI.Pages.render(e.detail.location, elem)
            .then(function () {
                if (e.detail.location == "/list.html") {
                    var local = e.detail.state;
                    WinJS.Utilities.setInnerHTML(WinJS.Utilities.query("#appHeaderTitle")[0], local );
                }
                WinJS.UI.Animation.enterPage(elem.children).done(
                    function () {
                        if (e.detail.location == "/index.html") {
                            page = 0;
                            WinJS.Utilities.query(".listviewpivotitem")
                                .listen("iteminvoked",
                                    function (invoke) {
                                        getNews(invoke);
                                    }, false);
                        }
                        /*
                             _ _   _                  _   _
                            / | |_| |__     __ _  ___| |_(_) ___  _ __
                            | | __| '_ \   / _` |/ __| __| |/ _ \| '_ \
                            | | |_| | | | | (_| | (__| |_| | (_) | | | |
                            |_|\__|_| |_|  \__,_|\___|\__|_|\___/|_| |_|
                        */
                        // News list by country.
                        if (e.detail.location == "/list.html") {
                            page = 1; // list.html
                            WinJS.Utilities.query(".listviewpivotitem")
                                .listen(
                                    "iteminvoked",
                                    function (invoke) {

                                        spinner.show();
                                        
                                        var clicked = invoke.detail.itemPromise._value.data;
                                        var index = invoke.detail.itemIndex;
                                        var list = document.getElementById("pivotScenario3").winControl._currentItem._contentElement.firstElementChild.winControl;
                                        transitionBetweenContent(
                                            clicked,
                                            function () {
                                                spinner.stop();
                                                list.ensureVisible(index);
                                            });
                                    }, false);
                        }
                    });
            });
    });

    WinJS.Utilities.query(".listviewpivotitem")
        .listen(
            "iteminvoked",
            function (invoke) {
                getNews(invoke);
            }, false
        );
});

function getNews(invoke, uselast, cb) {

    var spinner = spin();

    var location = uselast ? currentCountryData.data.url : invoke.detail.itemPromise._value.data.url;
    var name = uselast ? currentCountryData.data.name : invoke.detail.itemPromise._value.data.name;
    var to = uselast ? currentCountryData.data.lang : invoke.detail.itemPromise._value.data.lang;

    var setup = { 
        list : { "h":  "" // Blank special key search all
                ,"w":  ['world news','international politics','global politics','world crises']
                ,"b":  ['business','company', 'companies','money','stocks', 'shares', 'sell', 'buy']
                ,"n":  ['national','vilage','city','country']
                ,"t":  ['technology','mobile','tech','artificial inteligence','robot','computer software','computer hardware', 'computer games']
                ,"el": ['election','campaign','candidate','vote']
                ,"p":  ['politic','internation affair','parlament','law','legislation', 'court']
                ,"e":  ['entertainment','movie','music','paint', 'art']
                ,"s":  ['sports','tennis','soccer','hockey','estadium','qualify','qualifiers', 'race', 'game', 'world cup', 'martial arts']
                ,"m":  ['health','vacine','doctor','nurse','medicine','hospital','healthcare']},
        from: 'en',
        to: to || 'en',
        endpoint:"/getarticle?keywords=${topiclist}&location=${location}&from=${setup.from}&to=${setup.to}&name=${name}"
    };

    currentCountryData = invoke ? invoke.detail.itemPromise._value : currentCountryData;
    currentCountryData.data.ned=to;
    currentCountryData.data.hl=location;

    currentCountryData.content={};

    var thekeys= Object.keys(setup['list']);
    var requestCounter = thekeys.length;
    var topics =thekeys.map(function (area) {

        var topiclist= setup['list'][(area)]
        
        // console.log("RC",requestCounter)

        var cmd = eval("`" + setup.endpoint + "`")
        // console.log(cmd)
        fetch(cmd)
            .then(
                function (response) {
                    // console.log("Response:", response);

                    switch (response.status) {
                        case 200:
                            break;
                        default:
                            console.log('Looks like there was a problem. Status Code: ' + response.status);
                            return;
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {
                        // console.log("ResponseJSON:", topiclist, location, data);
                        switch (data.status) {
                            case 202:
                                updateBar();
                                spinner.stop();
                                console.log('Looks like there was a problem. Status Code: ' + data.status);
                                break;
                        }
                        --requestCounter
                       // console.log("RCC",requestCounter)
                        processResults(area, data)
                        if (requestCounter === 0)
                            WinJS.Navigation.navigate("/list.html", name).done(
                                function () {
                                    // console.log("Finished loading news");
                                    if (cb) cb();
                                });
                    }).catch(function (err) {
                        console.log('Fetch Error :-:', err);
                       
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    });
}

/****************************************************************
transitionBetweenContent
*/
var actout = 0;
var actin = 0;
var loaded = {};

function transitionBetweenContent(clicked, cb) {

    // Check loaded state
    if (typeof currentCountryData.content[clicked.id] !== 'undefined') {
        console.log('transitionBetweenContent_1',clicked.id, clicked.id2, clicked.id3, clicked.id4, cb);
        transitionBetweenContentToggle(clicked.id, clicked.id2, clicked.id3, clicked.id4, cb);

    } else {
        // console.log('transitionBetweenContent_2',clicked.id, clicked.id2, clicked.id3, clicked.id4, cb);
        currentCountryData.content[clicked.id] = true;
        loadImageForItem(clicked, clicked.id3);
        //loadVideoForItem(clicked, clicked.id4);
        // console.log('transitionBetweenContent_2',clicked.id2);

        WinJS.Utilities.query('[name="' + clicked.id2 + '"] a').forEach(function (itema) {
            itema.addEventListener("click",
                function (e) {

                    e.returnValue = false;
                    e.preventDefault();
                    e.stopPropagation();

                    window.open(this.href, 'Guganews');
                });
        });

        // console.log('bindMediaImage request');
        bindMediaImage(clicked.id2, clicked.id3, clicked.id4,
            function () {
                // console.log('bindMediaImage');
                transitionBetweenContentToggle(clicked.id, clicked.id2, clicked.id3, clicked.id4, cb);

            });
         // console.log('bindMediaImage request done');

    }

    return;

}

function transitionBetweenContentToggle(id, id2, id3, id4, cb) {

    var incoming;
    var outgoing;
    var output1 = document.querySelectorAll('[name="' + id + '"]')[0];
    var output2 = document.querySelectorAll('[name="' + id2 + '"]')[0];


    // Assign incoming and outgoing
    if (output2.style.display === "none") {

        //window[id3] = new WinJS.Binding.List([]);
        //window[id4] = new WinJS.Binding.List([]);


        incoming = output2;
        outgoing = output1;
    } else {
        incoming = output1;
        outgoing = output2;
    }



    if (actin) {
        if (actin == outgoing) {

            WinJS.UI.executeTransition(actin, {
                property: "opacity",
                delay: 0,
                duration: 150,
                timing: "linear",
                from: 1,
                to: 0
            }).done(function () {

                actout.style.display = "block";
                actin.style.display = "none";

                WinJS.UI.executeTransition(actout, {
                    property: "opacity",
                    delay: 0,
                    duration: 250,
                    timing: "linear",
                    from: 0,
                    to: 1
                }).done(function () {

                    cb();

                });
            });

            return;

        } else {

            actout.style.display = "block";
            actin.style.display = "none";
            actout.style.opacity = 1;
            actin.style.opacity = 0;
        }
    }


    actout = outgoing;
    actin = incoming;

    //bindMediaVideo(id2,id3,id4);

    WinJS.UI.executeTransition(outgoing, {
        property: "opacity",
        delay: 0,
        duration: 0,
        timing: "linear",
        from: 1,
        to: 0
    }).done(function () {

        outgoing.style.display = "none";
        incoming.style.display = "block";



        WinJS.UI.executeTransition(
            incoming, {
                property: "opacity",
                delay: 0,
                duration: 250,
                timing: "linear",
                from: 0,
                to: 1
            }).done(function () {

            cb();

        });
    });

}

// Update engine ******************************
boxopen = 0;
refreshtimeout = 1000 * 60 * 30;
tor = 0;

function updateBar() {
    /* Button action
        var appBar = document.getElementById("createAppBar").winControl;
        appBar.getCommandById("cmdAdd").addEventListener("click", 
        function(){ getNews(false,true);  }, false);
    */
    var m = setTimeout(function () {
        window.location.reload();
    }, 5000);

    if (boxopen) {
        return;
    }
    boxopen = 1;
    var cd = document.querySelector("#refresh");

    if (cd) {
        var contentDialog = document.querySelector("#refresh").winControl;
    } else {
        startupdate();
        return;
    }

    contentDialog.onafterhide = function () {

    };
    contentDialog._dom.commands[0].addEventListener(
        'click',
        function () {

            // if (page==0) {
            window.location.reload();
            /* }else if (page==1) {
                WinJS.Navigation.back().done(function(){
                    getNews(false,true,function(){ 
                        startupdate();
                     });
                    
                });
            }*/

            return;
        });
    contentDialog._dom.commands[1].addEventListener(
        'click',
        function () {
            clearTimeout(m);
            startupdate();
            return;
        });

    contentDialog.show();
    boxopen = 1;

}

function stopupdate(log) {
    if (log) console.log("updating call:start", tor, refreshtimeout, boxopen);
    boxopen = 0;
    if (tor) clearTimeout(tor);
    tor = 0;
}

function startupdate(force, log) {
    stopupdate(log);
    tor = setTimeout(updateBar, refreshtimeout);
    if (log) console.log("updating call:stop", tor, refreshtimeout, boxopen);
}