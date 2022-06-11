import express from "express"

import requestDB from "../serveur";
import userFormJWT from "./threadController";

interface ObjectUserFrom {
    id: number;
    username: string;
    discriminator: string;
    bio: string;
    avatarurl: string;
    following: string;
    follower: string;
    badgesshow: string;
    privatemessage:string;
    serveur:string;
    badges:string;
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
                    avatarurl: e.avatarurl,
                    following: e.following,
                    follower: e.follower,
                    badgesshow: e.badgesshow,
                }
            })
            if (userRes.length === 0) return res.send({ error: "user not found" });
            return res.status(201).send({ user: userRes });
        } catch (err) {
            res.send({ error: "user not found" })
        }
    },
    ObjectUserWithAuth: async (req: express.Request, res: express.Response) => {
        const requete = req.params.id;
        if ((express.user as {id:number}).id !== Number(requete)) return res.status(201).send({error:"id of user not match"});
        try {
            const userReq: ObjectUserFrom[] = ((await requestDB(`SELECT * FROM alpinezy_user WHERE id=${Number(requete)};`)).rows)
            const userRes = userReq.map((e: ObjectUserFrom) => {
                return {
                    id: e.id,
                    username: e.username,
                    discriminator: e.discriminator,
                    bio: e.bio,
                    avatarurl: e.avatarurl,
                    following: e.following,
                    follower: e.follower,
                    badgesshow: e.badgesshow,
                    badges:e.badges,
                    privatemessage:e.privatemessage,
                    serveur:e.serveur,
                }
            })
            if (userRes.length === 0) return res.send({ error: "user not found" });
            return res.status(201).send({ user: userRes });
        } catch (err) {
            res.send({ error: "user not found" })
        }
    }
}

import { uniqueSuffix } from "../router/userRoute";
export const setUser = {
    avatar: async (req: express.Request, res: express.Response) => {
        console.log(req.file, uniqueSuffix);
        res.send(`file-${uniqueSuffix}`);
    }
}