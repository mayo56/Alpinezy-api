import express from "express";
const authRoute = express();

import { authController } from "../controller/authController";

//methode de connexion : Login/Register
authRoute.post("/login", authController.signIn);
authRoute.post("/register", authController.signUp);

export default authRoute;
