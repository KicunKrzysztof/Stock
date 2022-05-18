# Stock

Simple MEAN stack app with financial charts. Presents, in one place, assets, which I frequently checked on multiple different sources.
Frontend uses Angular Material and interactive charts from angular-google-charts.
Deployed on HEROKU: https://kicunstock.herokuapp.com/, DB deployed on MongoDB.

## Screenshots
### PC:
![version on PC](https://github.com/KicunKrzysztof/Stock/blob/master/pc.jpg)

### Mobile:
![version on mobile](https://github.com/KicunKrzysztof/Stock/blob/master/mobile.jpg)

## Collecting data
App uses only free apis, therefore shots are very limited. MongoDB database was initiated with historical data by creator.js script. Current data are collected by  Express.js server. Same server responds on frontend requests. Server shoots free apis and saves crypto and currencies data every 30 minutes, for stocks and commodities it happens every 5 hours. Those are highest possible freuency for employed free apis. To make those countdowns work, deployed app is registered on http://kaffeine.herokuapp.com/, to prevent it from sleeping as much as possible.
