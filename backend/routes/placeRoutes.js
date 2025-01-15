import express from 'express'
import validateToken from '../middleware/validateTokenhandler.js'
import { uploadByLink, uploadFromDevice } from '../controllers/placeController.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();
router.use(validateToken);

router.route("/upload-by-link").post(uploadByLink);
router.route("/upload-from-device").post(upload.array('photos', 100), uploadFromDevice)

router.route("/test").get((req,res)=>{
    res.json("hi");
})

export default router;