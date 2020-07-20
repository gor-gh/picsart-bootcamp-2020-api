const express = require('express');
const router = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.set('port', process.env.PORT || 3002);

mongoose.Promise = global.Promise;
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/picsart-bootcamp-api-test",
    { useNewUrlParser: true }
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(app.get('port'),() => {
    console.log("The server is now running at http://localhost:" + app.get('port'))
})

console.log(mongoose.connection.name)