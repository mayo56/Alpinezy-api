import express, { NextFunction } from "express";

//les trucs pour le json
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

//bcrypt pour les mots de passe
import bcrypt from 'bcrypt';
const saltRounds = 10;

//le fichier d'environnement
require("dotenv").config({path:"../config/.env"});

//import jwt
import jwt from "jsonwebtoken";

//import de la fonction pour request la db
import requestDB from "../serveur";

interface singInInterface {
    email: string;
    password: string;
};
interface singUpInterface {
    pseudo: string;
    email: string;
    password: string;
};
interface FormArrayUser {
    id: string;
    username: string;
    discriminator: string;
    email: string;
    password: string;
    follower: string[];
    following: string[];
    guilds: string[]
};
export const authController = {
    //ici la fonction de connexion
    signIn: async (req: express.Request, res: express.Response) => {
        const body: singInInterface = req.body;
        if (!body.email || !body.password) return res.status(201).send({ error: "Il manque des éléments" });

        //ici notre db
        const AllUser:any = await requestDB("SELECT * FROM alpinezy_user;");
        
        let EmailIsValide: boolean = false;
        let PassWord: string = "";
        let indexOfUser:number = 0;
        let username = ""
        for (let i = 0; i < AllUser.rows.length; i++) {
            if (AllUser.rows[i].email === body.email) {
                EmailIsValide = true;
                PassWord = AllUser.rows[i].password;
                indexOfUser = i;
                username = AllUser.rows[i].username;
            };
        };
        if (EmailIsValide === false) {
            return res.status(201).send({ error: "Email invalide" });
        };

        bcrypt.compare(body.password, PassWord, function (err, result) {
            if (result === false) {
                return res.status(201).send({ error: "Mot de passe incorrect" })
            } else {
                const token = jwt.sign(
                    {
                        id:AllUser.rows[indexOfUser].id,
                        username:AllUser.rows[indexOfUser].username,
                        discriminator:AllUser.rows[indexOfUser].discriminator,
                    },process.env.TOKEN_JWT!
                )
                return res.status(200).cookie("alpinezy", token, { httpOnly:true}).send({token:token, userinfo:{username:username}});
            }
        })
    },



    //ici la fonction d'inscription
    signUp: async (req: express.Request, res: express.Response) => {
        const body: singUpInterface = req.body;
        if (!body.email || !body.password || !body.pseudo) return res.status(201).send({ error: "Il manque des éléments" });

        let AllDiscriminatorMatch: string[] = [];

        //les étapes de vérification
        let allUser: any = await requestDB("SELECT * FROM alpinezy_user;");
        allUser = allUser.rows;
        for (let i: number = 0; i < allUser.length; i++) {
            if (allUser[i].username === body.pseudo) {
                AllDiscriminatorMatch.push(allUser[i].discriminator);
            };
            if (allUser[i].email === body.email) {
                return res.status(201).send({ error: "Cette e-mail est déjà utilisé." });
            };
        };

        //ici on créer un discriminator
        let discriminatorUser: string = "0";
        let i = 0;
        function make() {
            while (discriminatorUser.length < 4) {
                discriminatorUser = "0" + discriminatorUser
            };
            return discriminatorUser;
        };
        while (AllDiscriminatorMatch[i] === make()) {
            discriminatorUser = (parseInt(discriminatorUser) + 1).toString();
            i += 1;
        };

        //on hash le password
        bcrypt.hash(body.password, saltRounds, async function (err, hash) {
            if (err) return res.status(201).send({ error: err });

            //on push les données
            await requestDB(`INSERT INTO alpinezy_user VALUES (${allUser.length + 1}, '${body.pseudo}', '${discriminatorUser}', '${body.email}', '${hash}');`);       

            return res.status(200).send({ success: "Inscription réussit !" });
        });
    }
};