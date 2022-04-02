const { MongoClient, AggregationCursor } = require('mongodb');
const csv = require('csv-parser');
const fs = require('fs');

async function main(filename, dataArray) {
    await fs.createReadStream(`data/${filename}.csv`)
    .pipe(csv())
    .on('data', (row) => {
        dataArray.push({
            date: new Date(row.Date.trim()),
            open: row.Open.trim(),
            high: row.High.trim(),
            low: row.Low.trim(),
            close: row.Close.trim()
        })
        })
    .on('end', async () => {
        await load(dataArray, filename);
        console.log('CSV file successfully processed');
    });
}

async function load(data, filename){
     const uri = "mongodb+srv://RandomUser:<PASSWD>@cluster0.fmstt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
     const client = new MongoClient(uri);
 
     try {
         await client.connect();
         await createData(client, filename, data)
     } finally {
         await client.close();
     }
}

async function createData(client, collection, newData){
    //const result = await client.db("stock").collection(collection).insertMany(newData);
    //console.log(`${result.insertedCount} new datas created`);
}

async function aggregation(){
    await main("btcusd", []);
    await main("ethusd", []);
    await main("dax", []);
    await main("ftse", []);
    await main("goldusd", []);
    await main("oilusd", []);
    await main("sp500", []);
    await main("eurpln", []);
    await main("usdpln", []);
}

aggregation();

// remove("btcusd");
// remove("ethusd");
// remove("dax");
// remove("ftse");
// remove("goldusd");
// remove("oilusd");
// remove("sp500");

// async function remove(filename){
//      const uri = "mongodb+srv://RandomUser:68rJMqMwnzEYQq8A@cluster0.fmstt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//      const client = new MongoClient(uri);
 
//      try {
//          await client.connect();
//          await client.db("stock").collection(filename).remove( { } );
//      } finally {
//          await client.close();
//      }
// }