const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.resolve(__dirname, './static')));

app.listen(4000, () => {
    console.log('running on port 4000');
})