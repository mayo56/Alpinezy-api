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



//poster dans le fil
import thread from "./router/threadRoute";
app.use("/api/thread", thread);



//Requêtes pour les utilisateurs 
import { UserCheck } from "./class/UserClass";
app.get("/api/user/:id", (req, res) => {
    const id = req.params.id;
    const response = new UserCheck(id, res, req).getUser();
});

//routes pour login/register
import authRoute from "./router/authRoute";
app.use("/api/auth", authRoute);


//route pour les messages
import msgRoute from "./router/msgRoute";
app.use("/api/message", msgRoute);



// ###############  //
// Partie socket.io //
// ###############  //

import { Server } from "socket.io"
export const io = new Server(9000)

io.on("connection", (socket) => {
    console.log(socket.id, "vient de se connecter !", socket.rooms)
    io.emit("hello", "Hello depuis le serveur !")

    socket.on("disconnect", (reason) => {
        console.log("Client déconnecté pour : " + reason)
    });
});



//le listener
app.listen(process.env.PORT, () => console.log("Connect !"));