const { MongoClient } = require('mongodb')
require('dotenv').config();

let dbConnection
const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASSWORD+'@lots.r785tlf.mongodb.net/lots-data?retryWrites=true&w=majority';

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            console.log("connected to db");
          return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}