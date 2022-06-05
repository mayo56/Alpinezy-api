import express from "express"

import requestDB from "../serveur";
import userFormJWT from "./threadController";

interface ObjectUserFrom {
    id: number;
    username: string;
    discriminator: string;
    bio: string;
    avatarurl: string;
}

export const GetUser = {
    ObjectUser: async (req: express.Request, res: express.Response) => {
        const requete = req.params.id;
        try {
            const userReq: ObjectUserFrom[] = ((await requestDB(`SELECT * FROM alpinezy_user WHERE id=${Number(requete)};`)).rows)
            const userRes = userReq.map((e: ObjectUserFrom) => {
                return {
                    id: e.id,
                    username: e.username,
                    discriminator: e.discriminator,
                    bio: e.bio,
                    avatarurl: e.avatarurl
                }
            })
            if (userRes.length === 0) return res.send({error: "user not found"});
            return res.status(201).send({ user: userRes });
        } catch (err) {
            res.send({error: "user not found"})
        }
    },
}

import { uniqueSuffix } from "../router/userRoute";
export const setUser = {
    avatar: async (req: express.Request, res: express.Response) => {
        console.log(req.file, uniqueSuffix);
        res.send(`file-${uniqueSuffix}`)
    }
}