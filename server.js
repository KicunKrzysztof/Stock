// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });
const update = require('./server_src/cron/update')

const express = require('express');
const cors = require('cors');
// get MongoDB driver connection
const dbo = require('./server_src/db/conn');

const PORT = process.env.PORT || 5000;
const app = express();

const path = require('path');

app.use(express.static('dist'));
app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'dist/index.html'));
})

app.use(cors());
app.use(express.json());
app.use(require('./server_src/routes/record'));

// Global error handling
app.use(function (err, _req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.log("mongo error")
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
  
  update.checkRarelyUpdate();

  setInterval(()=>{
    update.updateOften();
  }, 1800000)// 1800000 - 30 min
  
  setInterval(()=>{
    update.updateRarely();
  }, 18000000)//86400000 - 24h 43200000-12h 18000000 -5h
});

