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
            id: 21,
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

app.get("/game/:id", (req, res) => {
    if (isNaN(req.params.id)) { //isNan = não é um número
        res.sendStatus = 400 
    } else {
        let id = parseInt(req.params.id) //converte para númros inteiros
        let game = DB.games.find(g => g.id == id) //pega o primeiro número que ele achar
        if (game != undefined) {
          res.statusCode = 200
          res.json(game)
        } else {
            res.sendStatus(404)
        }
    }
})

//app.post = cadrastar + game = cadastrar um game
app.post("/game", (req, res) => {
    let {title, price, year} = req.body /*pega o req.body de todos de uma vez e atribui a variavel ao proprio nome*/
    DB.games.push({
        id:2323,
        title,
        price,
        year
    })
    res.sendStatus(200)
})

app.delete("/game/:id", (req, res) => {
        if (isNaN(req.params.id)) { //isNan = não é um número
            res.sendStatus = 400 
        } else {
            let id = parseInt(req.params.id) //converte para númros inteiros
            let index = DB.games.findIndex(g => g.id == id) //
            if (index == -1) { 
                res.sendStatus(404)
            } else {
                DB.games.splice(index,1) //
                res.sendStatus(200)
            }
        } 
})

app.put("/game/:id", (req, res) => {
    if (isNaN(req.params.id)) { //isNan = não é um número
        res.sendStatus = 400 
    } else {
        let id = parseInt(req.params.id) //converte para númros inteiros
        let game = DB.games.find(g => g.id == id) //pega o primeiro número que ele achar
        if (game != undefined) { //quer dizer q existe
            let {title, price, year} = req.body
            if (title != undefined) {
                game.title = title
            }
            if (price != undefined) {
                game.price = price
            }
            if (year != undefined) {
                game.year = year
            } 
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    }
})

app.listen(45678, () => {
    console.log("Tudo certo!")
})