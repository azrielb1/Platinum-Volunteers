const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    fs.readFile('./logs.txt', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(data);
        return res.end();
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})