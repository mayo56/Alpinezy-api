//On créer l'app avec express
import express from "express";
const app = express();

//On configure dotenv pour le fichier d'environnement
require("dotenv").config({ path: "./config/.env" });




///////////////////////////////////////////////--------------
// ############ //
//  PostgreSQL  //
// ############ //
import { Client } from "pg";

const credentials = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'AlpinezyDB',
    password: process.env.DB_PASSWORD,
    port: 5432
};
export default async function requestDB(req: string) {
    const client = new Client(credentials);  
    await client.connect();
    const now = await client.query(req);
    await client.end();
    return now;
};
///////////////////////////////////////////////--------------

//on créer le cors
import cors from "cors";
app.use(cors());
app.use(express.json());


//test images
import path from "path"

app.get("/lol", (req, res) => {
    res.sendFile("./images/avatarFile/paimon_4543.jpg")
})
app.get('/image/:name', function (req, res, next) {
    var options = {
      root: path.join(__dirname, 'images/avatarFile'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
  
    var fileName = req.params.name
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err)
      } else {
        console.log('Sent:', fileName)
      }
    })
  })


//poster dans le fil
import thread from "./router/threadRoute";
app.use("/api/thread", thread);



//Requêtes pour les utilisateurs 
/*
import { UserCheck } from "./class/UserClass";
app.get("/api/user/:id", (req, res) => {
    const id = req.params.id;
    const response = new UserCheck(id, res, req).getUser();
});*/

//routes pour login/register
import authRoute from "./router/authRoute";
app.use("/api/auth", authRoute);


//route pour les messages
import msgRoute from "./router/msgRoute";
app.use("/api/message", msgRoute);

//route get user
import userRoute from "./router/userRoute";
app.use("/api/user", userRoute);


// ###############  //
// Partie socket.io //
// ###############  //

import { Server } from "socket.io"

export const io = new Server(3001, {"cors":{"origin":'*', "allowedHeaders":"*", "methods":"*"}})


io.on("connection", (socket) => {
    console.log(socket.id, "vient de se connecter !", socket.rooms)
    io.emit("hello", socket.id ,"Hello depuis le serveur !")

    socket.on("disconnect", (reason) => {
        console.log("Client déconnecté pour : " + reason)
    });
});



//le listener
app.listen(process.env.PORT, () => console.log("Connect ! " + process.env.PORT));