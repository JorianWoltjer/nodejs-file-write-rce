const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const PORT = 8000;

const app = express()
app.use(bodyParser.json())

app.post('/upload', (req, res) => {
    const { filename, content } = req.body;
    console.log({ filename, content })
    fs.writeFile(filename, content, () => {
        res.json({ message: 'File uploaded!' });
    });
});

console.log(`Listening on 0.0.0.0:${PORT}...`)
app.listen(PORT)
