import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

import express from "express";


interface FormArrayUser {
    id: string;
    username: string;
    discriminator:string;
    email:string;
    follower: string[];
    following: string[];
    guilds: string[]
}
export class UserCheck {
    #AllUser: Array<FormArrayUser>;

    constructor(private id: string, private res:express.Response, private req:express.Request) {
        let db = new JsonDB(new Config("bdd/users.json", true, true, '/'));
        this.#AllUser = db.getData("/users");
    };

    public getUser() {
        let reponse:boolean = false;
        let index:number = 0;
        for (let i:number = 0; i < this.#AllUser.length; i++) {
            if (this.#AllUser[i].id === this.id) {
                reponse = true;
                index = i;
                break;
            };
        };
        if (reponse === true) {
            return this.res.json(this.#AllUser[index]);
        } else {
            return this.res.json({ error: "Aucun utilisateur reconnue" });
        };
    };
};