const express = require("express")
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let DB = {
    games: [
        {
            id: 23,
            title: "call of duty MW",
            yearr: 2019,
            price: 60
        },
        {
            id: 23,
            title: "Sea of thieves",
            yearr: 2018,
            price: 40
        },
        {
            id: 2,
            title: "Minecraft",
            yearr: 2012,
            price: 20
        }
    ]
}

app.get("/games", (req, res) => {
    res.statusCode = 200 //para dizer o status 
  res.json(DB.games) //Para passar uma informação no formato json
})

app.get("game/:id", (req, res) => {
    if (isNaN(req.params.id)) { //isNan = não é um número
        res.sendStatus = 400 
       console.log("Isso não é um número!")
    } else {
        let id = parseInt(req.params.id) //converte para númros inteiros

        let game = DB.game.find(g => g.id == id) //pega o primeiro número que ele achar

        if (game != undefined) {
          res.statusCode = 200
          res.json(game)
        } else {
            res.sendStatus(404)
        }
    }
})

app.listen(45678, () => {
    console.log("Tudo certo!")
})