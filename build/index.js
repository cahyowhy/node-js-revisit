"use strict";
const express = require('express');
const app = express();
const path = require('path');
// app.get('/', (req, res) => {
//     res.send('hello world');
// });
app.listen(3000, function () {
    console.log('app are running on port : 3000');
});
app.use(express.static(path.join(__dirname, '../public')));
