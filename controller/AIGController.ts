import express from "express"
import requestDB from "../serveur";

export const AIG = {
    getBadges: async (req:express.Request, res:express.Response) => {
        const idRequest =  req.params.id;
        const badgeResponse = (await requestDB("SELECT * FROM alpinezy_badges WHERE id="+idRequest+";")).rows;
        if (badgeResponse.length < 1) return res.status(401).send({error:"Badge not found"});
        res.status(201).send({badge: badgeResponse});
    },
}