const express = require('express')
const app = express()

// serve css files
app.use(express.static(__dirname)) // for homepage
app.use(express.static(__dirname+"/src/assets/CharcuterieStacker"))

// say which port to localhost on
app.listen(13370);

app.get('/', (req, res) => {
    res.sendFile('index.html', {'root':__dirname})
})

app.get('/game', (req, res) => {
    res.sendFile('src/assets/CharcuterieStacker/game.html', {'root':__dirname})
})