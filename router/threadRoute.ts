import express from "express";
const thread = express();

import { threadController } from "../controller/threadController"
import { jwt_CheckAuth } from "../middleware/jwt-chechAuth"

//methode des thread : post/require
thread.post("/post", jwt_CheckAuth, threadController.post)
thread.patch("/modify", jwt_CheckAuth, threadController.patch)
thread.delete("/delete", jwt_CheckAuth, threadController.delete)


export default thread;