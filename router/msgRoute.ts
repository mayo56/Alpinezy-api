import express from "express";
const msgRoute = express();


import { msgController } from "../controller/msgController";
import { jwt_CheckAuth } from "../middleware/jwt-chechAuth";


msgRoute.post("/send", jwt_CheckAuth, msgController.send);
msgRoute.get("/lastMessage",jwt_CheckAuth, msgController.lastMessage);
msgRoute.get("/allMessages/:id", jwt_CheckAuth, msgController.allMessages)


export default msgRoute;