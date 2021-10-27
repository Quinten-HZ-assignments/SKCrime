const express = require('express');
const app = express();
const port = 3000;

// Static files server
app.use('/static', express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});