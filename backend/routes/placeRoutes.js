import express from 'express'
import validateToken from '../middleware/validateTokenhandler.js'
import { addAccomodation, getAccomodationById, getAccomodations, updateAccomodation, uploadByLink, uploadFromDevice } from '../controllers/placeController.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();
router.use(validateToken);

router.route("/photo/upload-by-link").post(uploadByLink);
router.route("/photo/upload-from-device").post(upload.array('photos', 100), uploadFromDevice);
router.route("/add").post(addAccomodation);
router.route("/my-places").get(getAccomodations);
router.route("/:id").get(getAccomodationById).put(updateAccomodation);;

router.route("/test").get((req,res)=>{
    res.json("hi");
})

export default router;