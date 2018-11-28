const mongoose = require('mongoose');

//Map global promises
mongoose.Promise = global.Promise;

//Mongooese connect
mongoose.connect('mongodb://owais:owais123@ds119024.mlab.com:19024/pusherpoll', { useNewUrlParser: true })
    .then(() => console.log("Mongo Connected"))
    .catch(err => console.log(err));