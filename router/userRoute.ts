import expres from "express";
const userRoute = expres()

// multer (images)
import multer from "multer";
import path from "path";

//objets de control
import { GetUser } from "../controller/userController";
import { setUser } from "../controller/userController";
import { jwt_CheckAuth } from "../middleware/jwt-chechAuth";

//test
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({ storage })

//partie GET
userRoute.get("/get/:id", GetUser.ObjectUser);

//partie POST
//setUser.avatar
userRoute.post("/setAvatar", upload.single("file"), setUser.avatar);

export default userRoute;