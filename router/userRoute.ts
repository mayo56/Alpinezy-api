import expres from "express";
const userRoute = expres()

// multer (images)
import multer from "multer";

//objets de control
import { GetUser } from "../controller/userController";
import { setUser } from "../controller/userController";
import { jwt_CheckAuth } from "../middleware/jwt-chechAuth";
/////////////////////////////////-----------------------
//Partie Multer pour les images
export let uniqueSuffix = "";
const storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/avatarFile');
    },
    filename: function (req, file, cb) {
        uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const storageBanner = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/bannerFile');
    },
    filename: function (req, file, cb) {
        uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const uploadAvatar = multer({ storage: storageAvatar });
const uploadBanner = multer({ storage: storageBanner });
//////////////////////////////////-----------------------------
// Partie get d'image
import path from "path";
var optionsAvatar = {
    root: path.join(__dirname, 'images/avatarFile'),
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
}
var optionsBanner = {
    root: path.join(__dirname, 'images/bannerFile'),
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
}

//partie GET
userRoute.get("/get/:id", GetUser.ObjectUser); //chercher les info utilisateurs
/**
 * Récupérer la photo de profile
 */
userRoute.get('/avatar/:name', function (req, res, next) {
    var fileName = req.params.name
    res.sendFile(fileName, optionsAvatar, function (err) {
        if (err) {
            next(err)
        } else {
            console.log('Sent:', fileName)
        }
    })
})
/**
 * Récupérer la bannière
 */
userRoute.get('/banner/:name', function (req, res, next) {
    var fileName = req.params.name
    res.sendFile(fileName, optionsBanner, function (err) {
        if (err) {
            next(err)
        } else {
            console.log('Sent:', fileName)
        }
    })
})

//partie POST
userRoute.post("/setAvatar", jwt_CheckAuth, uploadAvatar.single("file"), setUser.avatar); // Ajouter une photo de profile
userRoute.post("/setBanner", jwt_CheckAuth, uploadBanner.single("file"), setUser.avatar); // Ajouter une bannière

export default userRoute;