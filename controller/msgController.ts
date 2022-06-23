import express from 'express';
import requestDB, { io } from '../serveur';

import userFormJWT from "./threadController";


export const msgController = {
    send: async (req:express.Request, res:express.Response) => {
        const body:{ message:string, channelID:string } = req.body;
        const jwt_auth:userFormJWT = express.user as userFormJWT;

        if(!body.message) return res.status(401).send({error:"elements manquant"});
        
        const allMessage = (await requestDB(`SELECT count(*) FROM channel_${body.channelID};`)).rows;
        const timestamp = Date.now().toString();
        try {
            await requestDB(`INSERT INTO channel_${body.channelID} VALUES (${Number(allMessage[0].count) + 1}, '${body.message}', '${jwt_auth.id}', 0, '${timestamp}');`);
            res.status(201).send({success:"message envoyé !"});
            io.emit("messageCreate", {
                id:Number(allMessage[0].count) + 1,
                content:body.message,
                author:jwt_auth.id,
                isreply:0,
                timestamp:timestamp,
                channelID:body.channelID
            });
            return
        }catch(err) {
            return res.status(401).send({error:"Un problème est survenue:" + err});
        };
    },
    lastMessage: async (req:express.Request, res:express.Response) => {
        const allMessage = await requestDB("SELECT * FROM alpinezy_channel ORDER BY id DESC LIMIT 1;")
        return res.status(201).send(allMessage.rows);
    },
    allMessages: async (req:express.Request, res:express.Response) => {
        const AllMessage = await requestDB(`SELECT * FROM channel_${req.params.id} ORDER BY id DESC LIMIT 20;`);
        return res.status(201).send(AllMessage.rows.reverse());
    }
};