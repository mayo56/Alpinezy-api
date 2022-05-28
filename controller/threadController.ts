import express from "express";

//bdd json
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import requestDB from "../serveur";

//socket.io
import { io } from "../serveur";

interface PostFrom {
    message: string;
};
export default interface userFormJWT {
    id: string;
    username: string;
    discriminator: string;
}
export const threadController = {
    post: async (req: express.Request, res: express.Response) => {
        const body: PostFrom = req.body;
        const UserInfoJWT: userFormJWT = express.user as userFormJWT;

        const Allpost = await requestDB("SELECT * FROM alpinezy_thread;");
        const MessageSansApostrophe = body.message.split(/'/g);
        try {
            await requestDB(`INSERT INTO alpinezy_thread (id, user_id, message, timestamp) VALUES (${(Allpost.rows.length + 1)}, ${UserInfoJWT.id}, '${MessageSansApostrophe}', '${Date.now().toString()}');`);
            io.emit("newPost");
            return res.status(201).send({ success: "Post correctement ajouté !" });
        } catch (err) {
            console.log(err)
            return res.status(401).send({ error: err });
        };
    },
    patch: async (req: express.Request, res: express.Response) => {
        const body: { idPost: string, message: string } = req.body;

        const AllPost: any = (await requestDB("SELECT * FROM alpinezy_thread;")).rows;

        const UserInfoJWT: userFormJWT = express.user as userFormJWT;
        if (UserInfoJWT.id !== AllPost[Number(body.idPost)].user_id) return res.status(401).send({ error: "l'id JWT et l'user post ne correspondent pas" });
        if (!AllPost[Number(body.idPost)]) return res.status(401).send({ error: "Ce post n'existe pas" });

        await requestDB(`UPDATE alpinezy_thread SET message = '${body.message}' WHERE id = ${Number(body.idPost)};`)
        return res.status(201).send({ success: "Post correctement modifié" })
    },
    delete: async (req: express.Request, res: express.Response) => {
        const body: { idPost: string } = req.body;
        const jwt_auth: userFormJWT = express.user as userFormJWT;

        const AllPost: any = (await requestDB("SELECT * FROM alpinezy_thread;")).rows;
        if (AllPost[Number(body.idPost)].user_id !== jwt_auth.id) return res.status(401).send({ error: "vous n'êtes pas le propriétaire du post" });

        if (!AllPost[Number(body.idPost)]) return res.status(401).send({ error: "Ce post n'existe pas" });

        await requestDB(`UPDATE alpinezy_thread SET message='' WHERE id = ${Number(body.idPost)};`);
        return res.status(201).send({ success: "Post correctement supprimé" });
    },
    requestAllPost: async (req: express.Request, res: express.Response) => {
        const AllPost = await requestDB("SELECT * FROM alpinezy_thread ORDER BY id DESC LIMIT 20;");
        res.status(201).send({post:AllPost.rows});
    }
};