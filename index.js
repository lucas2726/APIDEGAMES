const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const JWTsecret = "H21DDDGDYG2GYGDXYXDYNYN"

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

function auth(req, res, next) {
    const authToken = req.headers['authorization']
    
    if(authToken != undefined) {
      const bearer = authToken.split(' ')
      let token = bearer[1]

      jwt.verify(token, JWTsecret,(err, data) => {
      if (err) {
         res.status(401)
         res.json({err: "Token invalido!"})
      } else {
        req.token = token
        req.loggedUser = {id: data.id, email: data.email}
        next()
      }
      })
    } else {
        res.status(401)
        res.json({err: "Token invalido!"})
    }
}

/* Esse código parece ser um middleware de autenticação em Node.js usando o pacote jsonwebtoken (jwt) para verificar tokens de acesso.

- A função auth é um middleware que recebe três parâmetros: req, res, e next. É comum em frameworks como o Express.js para o Node.js.
- const authToken = req.headers['authorization'] extrai o cabeçalho de autorização da requisição.
- Ele verifica se o authToken está presente e, se estiver, assume que segue o padrão 'Bearer token'. Ele divide o authToken para extrair o token real.
- Utiliza jwt.verify para verificar a validade do token usando uma chave secreta (JWTsecret).
- Se o token for válido, adiciona informações ao objeto req (requisição), como o próprio token, dados do usuário (como id e email extraídos do token) e possivelmente informações da empresa (req.empresa = "Guia do programador").
- Se o token não for válido ou estiver ausente, envia uma resposta de erro com status 401 e um JSON indicando que o token é inválido.

Esse middleware é usado para proteger rotas ou endpoints, garantindo que apenas usuários autenticados e autorizados possam acessá-los. */

let DB = {
    games: [
        {
            id: 23,
            title: "call of duty MW",
            year: 2019,
            price: 60
        },
        {
            id: 21,
            title: "Sea of thieves",
            year: 2018,
            price: 40
        },
        {
            id: 2,
            title: "Minecraft",
            year: 2012,
            price: 20
        }
    ],

    users: [
        { 
        id: 1,
        name: "Victor Lima",
        email: "victordevt@guiadoprogramador",
        password: "nodejs<3"
        },
        {
            id: 19,
            name: "Lucas",
            email: "lucas@gmail.com",
            password: "lucas123"
        }
    ]
}

app.get("/games",auth, (req, res) => {

    let HATEOAS = [
        {
          href: "http//localhost:45678/game/"+id ,
          method: "DELETE" ,
          rel: "Deleta um game!"
        },
        {
            href: "http//localhost:45678/game/"+id ,
            method: "GET" ,
            rel: "het_game" 
        },
        {
            href: "http//localhost:45678/auth" ,
            method: "POST" ,
            rel: "login" 
        }
    ]

    res.statusCode = 200 //para dizer o status 
  res.json({games: DB.games, _links: HATEOAS}) //Para passar uma informação no formato json
})

app.get("/game/:id", auth,(req, res) => {
    if (isNaN(req.params.id)) { //isNan = não é um número
        res.sendStatus(400) 
    } else {
        let id = parseInt(req.params.id) //converte para númros inteiros

        let HATEOAS = [
            {
              href: "http//localhost:45678/game/"+id ,
              method: "DELETE" ,
              rel: "Delete_game"
            },
            {
                href: "http//localhost:45678/game/"+id ,
                method: "PUT" ,
                rel: "edit_game!"
              },
            {
                href: "http//localhost:45678/game/"+id ,
                method: "GET" ,
                rel: "get_game" 
            },
            {
                href: "http//localhost:45678/auth" ,
                method: "GET" ,
                rel: "get_all_games" 
            }
        ]

        let game = DB.games.find(g => g.id == id) //pega o primeiro número que ele achar
        if (game != undefined) {
          res.statusCode(200)
          res.json({game, _links: HATEOAS})
        } else {
            res.sendStatus(404)
        }
    }
})

//app.post = cadrastar + game = cadastrar um game
app.post("/game", auth, (req, res) => {
    let {title, price, year} = req.body /*pega o req.body de todos de uma vez e atribui a variavel ao proprio nome. Respeitar sempre oq a API pede*/
    DB.games.push({
        id:2323,
        title,
        price,
        year
    })
    res.sendStatus(200)
})

app.delete("/game/:id", auth, (req, res) => {
        if (isNaN(req.params.id)) { //isNan = não é um número
            res.sendStatus = 400 
        } else {
            let id = parseInt(req.params.id) //converte para númros inteiros
            let index = DB.games.findIndex(g => g.id == id) //
            if (index == -1) { 
                res.sendStatus(404)
            } else {
                DB.games.splice(index,1) //para remover 
                res.sendStatus(200)
            }
        } 
})

app.put("/game/:id", auth,(req, res) => {
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

app.post("/auth", (req, res) => {

    let {email, password} = req.body

    if (email != undefined) {

        let user = DB.users.find(u => u.email == email) //Para achar se um email igual no BD

      if (user != undefined) {

        if (user.password == password) {

        jwt.sign({id: user.id, email: user.email},JWTsecret,{expiresIn:'48h'}, (err, token) => {
            if (err) {
            res.status(400)
            res.json({err: "Falha interna"})
            } else {
            res.status(200)
            res.json({token: token})
            }
        })

        } else {
         res.status(401)
         res.json({err: "Credenciais inválidas!"})
        }
      } else {
       res.status(401)
       res.json({err: "O email cadastrado não existe na base de dados!"})
      }
    } else {
       res.status(400)
       res.json({err: "O email enviado é invalido"})
    }





})

app.listen(45678, () => {
    console.log("API rodando!")
})