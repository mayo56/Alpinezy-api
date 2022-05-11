import jwt, { Secret } from "jsonwebtoken";
import express from "express";

require("dotenv").config()

export const jwt_CheckAuth = (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const token = req.headers.authorization;
    if (!token)return console.log("Ne contien pas de token dans le header");
    console.log(token)

    try {
        const haveToken = jwt.verify(token, process.env.TOKEN_JWT!);
        express.user = haveToken
    }catch(err) {
        console.log("pas de token");
        return res.status(401).send({error:"Une erreur s'est produite."});
    };
    next();
}

