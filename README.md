# Guganews

## This is a simple web client news reader for newsapi.org

We are also using online translation services (yandex) in order to build the news queries.

For a better user experience please use an Android System with the default Chrome web browser.

The main components are:
* WinJS3
* Nodejs 6
* newsapi.org (REST API)
* translate.yandex.net (REST API)

![Image of Yaktocat](https://raw.githubusercontent.com/freedomson/guganews/master/gn.png)

### Install & run
```
export TRANS_KEY=trnsl.1.XXX // Get a key for the translate api here https://tech.yandex.com/translate/
export NAPI= XXX // Get a key at https://newsapi.org/login
node server.js

http://localhost:8080
```
### Live demo
http://www.guganews.com

### Openshift V3
Compatible (Don't forget the ENV's vars.)
