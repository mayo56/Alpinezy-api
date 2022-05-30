import expres from "express";
const userRoute = expres()

// multer (images)
import multer from "multer";
import path from "path";

//objets de control
import { GetUser } from "../controller/userController";
import { setUser } from "../controller/userController";
import { jwt_CheckAuth } from "../middleware/jwt-chechAuth";

//Partie Multer pour les images
export let uniqueSuffix = "";
const storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/avatarFile')
    },
    filename: function (req, file, cb) {
        uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const storageBanner = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/bannerFile')
    },
    filename: function (req, file, cb) {
        uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const uploadAvatar = multer({ storage: storageAvatar })
const uploadBanner = multer({ storage: storageBanner })

//partie GET
userRoute.get("/get/:id", GetUser.ObjectUser); //chercher les info utilisateurs

//partie POST
userRoute.post("/setAvatar", jwt_CheckAuth, uploadAvatar.single("file"), setUser.avatar); // Ajouter une photo de profile
userRoute.post("/setBanner", jwt_CheckAuth, uploadBanner.single("file"), setUser.avatar); // Ajouter une bannière

export default userRoute;