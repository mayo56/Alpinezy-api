import express from "express"

import requestDB from "../serveur";

interface ObjectUserFrom  {
    id:number;
    username:string;
    discriminator:string;
}

export const GetUser = {
    ObjectUser:async(req:express.Request, res:express.Response) =>{
        const requete= req.params.id;
        const userReq:ObjectUserFrom[] = ((await requestDB(`SELECT * FROM alpinezy_user WHERE id=${Number(requete)};`)).rows)
        const userRes = userReq.map((e:ObjectUserFrom) => {
            return {
                id:e.id,
                username:e.username,
                discriminator:e.discriminator
            }
        })
        return res.status(201).send({user : userRes});
    }
}