const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the records.
recordRoutes.get('/:collection/:from', (req, res) => {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection(req.params.collection)
    .find({date: {$gt: new Date(req.params.from)}})
    .sort({date: -1})
    .toArray(function (err, dbArray) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        result = []
        dbArray.forEach(element => {
          result.push([
            element.date,
            element.close
          ])
        });
        res.json(result);
      }
    });
});

module.exports = recordRoutes;
