import express from "express"

import requestDB from "../serveur";
import userFormJWT from "./threadController";

interface ObjectUserFrom {
    id: number;
    username: string;
    discriminator: string;
    bio:string;
    avatarURL:string;
}

export const GetUser = {
    ObjectUser: async (req: express.Request, res: express.Response) => {
        const requete = req.params.id;
        const userReq: ObjectUserFrom[] = ((await requestDB(`SELECT * FROM alpinezy_user WHERE id=${Number(requete)};`)).rows)
        const userRes = userReq.map((e: ObjectUserFrom) => {
            return {
                id: e.id,
                username: e.username,
                discriminator: e.discriminator,
                bio: e.bio,
                avatarURL: e.avatarURL
            }
        })
        return res.status(201).send({ user: userRes });
    },
}

import { uniqueSuffix } from "../router/userRoute";
export const setUser = {
    avatar:async (req:express.Request, res:express.Response) => {
        console.log(req.file, uniqueSuffix);
        res.send(`file-${uniqueSuffix}`)
    }
}