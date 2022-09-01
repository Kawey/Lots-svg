const express = require('express');
require('dotenv').config();
const { connectToDb, getDb } = require('./db')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json())

let db

connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Starting server at ${port}`);
    });
    db = getDb()
  }
})

app.get('/lots', (req, res) => {

  let lots = [];

  db.collection('lots')
    .find()
    .forEach(lot => lots.push(lot))
    .then(() => {
      res.status(200).json(lots)
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not fetch the documents' })
    })
})