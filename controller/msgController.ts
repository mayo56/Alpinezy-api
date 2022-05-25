import express from 'express';
import requestDB, { io } from '../serveur';

import userFormJWT from "./threadController";


export const msgController = {
    send: async (req:express.Request, res:express.Response) => {
        const body:{message:string} = req.body;
        const jwt_auth:userFormJWT = express.user as userFormJWT;

        if(!body.message) return res.status(401).send({error:"elements manquant"});
        
        const allMessage = await requestDB("SELECT * FROM alpinezy_channel;");

        try {
            await requestDB(`INSERT INTO alpinezy_channel VALUES (${allMessage.rowCount + 1}, '${body.message}', '${jwt_auth.id}', '${Date.now().toString()}');`);
            io.emit("messageCreate", {channelid:"test"});
            return res.status(201).send({success:"message envoyé !"});
        }catch(err) {
            res.status(401).send({error:"Un problème est survenue:" + err});
        };
    },
    lastMessage: async (req:express.Request, res:express.Response) => {
        const allMessage = await requestDB("SELECT * FROM alpinezy_channel ORDER BY id DESC LIMIT 1;")
        return res.status(201).send(allMessage.rows);
    },
    allMessages: async (req:express.Request, res:express.Response) => {
        const AllMessage = await requestDB("SELECT * FROM alpinezy_channel ORDER BY id DESC LIMIT 20;");
        return res.status(201).send(AllMessage.rows.reverse());
    }
};