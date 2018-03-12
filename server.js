const express = require('express')
const app = express()
const path = require('path');


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.listen(80);