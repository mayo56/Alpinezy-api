import expres from "express";
const userRoute = expres()

import { GetUser } from "../controller/userController";

userRoute.get("/get/:id", GetUser.ObjectUser);


export default userRoute;