const dbo = require('../db/conn');
const axios = require('axios')
const alphavantageKey = process.env.ALPHAVANTAGEKEY;
const commoditiesKey = process.env.COMMODITIESKEY;
const eodKey = process.env.EODKEY;

const zeroPad = (num, places) => String(num).padStart(places, '0')

function updateFromAlpha(from, to, collection){
    axios
      .get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${alphavantageKey}`)
      .then(res => {
        const dbConnect = dbo.getDb();
        date = new Date();
        const newDocument = {
            date: date,
            open: res.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"],
            high: res.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"],
            low: res.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"],
            close: res.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
        }

        dbConnect
        .collection(collection)
        .insertOne(newDocument, function (err, result) {
          if (err) {
            console.log(`Error during updating ${collection}`);
          } else {
            console.log(`Added a new document with id ${result.insertedId}, collection: ${collection}`);
          }
        })
    })
      .catch(error => {
        console.error(error)
      })
}

function updateFromCommodity(){
    axios
      .get(`https://www.commodities-api.com/api/latest?access_key=${commoditiesKey}&symbols=XAU,WTIOIL`)
      .then(res => {
        const dbConnect = dbo.getDb();
        date = new Date(res.data["data"]["date"]);
        goldPrice = (1.0 / res.data["data"]["rates"]["XAU"]);
        oilPrice = (1.0 / res.data["data"]["rates"]["WTIOIL"]);
        const newGoldDocument = {
            date: date,
            open: goldPrice,
            high: goldPrice,
            low: goldPrice,
            close: goldPrice
        }
        const newOilDocument = {
            date: date,
            open: oilPrice,
            high: oilPrice,
            low: oilPrice,
            close: oilPrice
        }

        dbConnect
        .collection("goldusd")
        .insertOne(newGoldDocument, function (err, result) {
          if (err) {
            console.log(`Error during updating goldusd`);
          } else {
            console.log(`Added a new document with id ${result.insertedId}, collection: goldusd`);
          }
        })
        dbConnect
        .collection("oilusd")
        .insertOne(newOilDocument, function (err, result) {
          if (err) {
            console.log(`Error during updating oilusd`);
          } else {
            console.log(`Added a new document with id ${result.insertedId}, collection: oilusd`);
          }
        })
    })
      .catch(error => {
        console.error(error)
      })
}

function updateFromEOD(symbol, collection){
    fromDate = new Date((new Date()).getTime() - (1000 * 60 * 60 * 24));
    fromString = `${fromDate.getFullYear()}-${zeroPad(fromDate.getMonth() + 1, 2)}-${zeroPad(fromDate.getDate(), 2)}`;
    axios
      .get(`https://eodhistoricaldata.com/api/eod/${symbol}?api_token=${eodKey}&fmt=json&from=${fromString}`)
      .then(res => {
        const dbConnect = dbo.getDb();
        if (res.data.length != 0){
        resOb = res.data[res.data.length - 1]
        date = new Date(resOb.date);
        const newDocument = {
            date: date,
            open: resOb.open,
            high: resOb.high,
            low: resOb.low,
            close: resOb.close
        }

        dbConnect
        .collection(collection)
        .insertOne(newDocument, function (err, result) {
          if (err) {
            console.log(`Error during updating ${collection}`);
          } else {
            console.log(`Added a new document with id ${result.insertedId}, collection: ${collection}`);
          }
        })
    }
    })
      .catch(error => {
        console.error(error)
      })
}

var self = module.exports = {
    updateOften: function(){
        updateFromAlpha("BTC", "USD", "btcusd");
        updateFromAlpha("ETH", "USD", "ethusd");
        updateFromAlpha("USD", "PLN", "usdpln");
        updateFromAlpha("EUR", "PLN", "eurpln");
    },

    updateRarely: function(){
        updateFromCommodity();
        updateFromEOD("GDAXI.INDX", "dax");
        updateFromEOD("GSPC.INDX", "sp500");
        updateFromEOD("FTSE.INDX", "ftse");
    },

    checkRarelyUpdate: function(){
      var currDate = new Date();
      if (currDate.getHours() < 11)
        return;
        const dbConnect = dbo.getDb();
        dbConnect.collection('dax')
        .find({})
        .sort({date: -1})
        .limit(1)
        .toArray(function (err, dbArray) {
          if (err) {
            console.log("error in checkRarelyUpdate")
          } else {
            lastDbDate = new Date(dbArray[0].date)
            if (lastDbDate.getDate() != currDate.getDate())
              self.updateRarely();
          }
        });
    }
}