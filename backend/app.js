const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');


const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
// chunnQCGlavBQdSI  --MongoDb user leonard
const app = express();

//mongoose.connect('mongodb://127.0.0.1/node_angular')

mongoose.connect(`mongodb://${process.env.MG_LB_USR}:${process.env.MG_LB_PWD}@ds022408.mlab.com:22408/mean_blog`)
.then(() => {
    console.log('Connected to database');
})
.catch(() => {
    console.log('Failed to connect');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader(
        'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    res.setHeader(
        'Access-Control-Allow-Methods',
     'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;