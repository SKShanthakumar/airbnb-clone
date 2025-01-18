import express from 'express'
import validateToken from '../middleware/validateTokenhandler.js'
import { addAccomodation, getAccomodationById, getAccomodations, getMyAccomodations, updateAccomodation, uploadByLink, uploadFromDevice } from '../controllers/placeController.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

// public routes
router.route("/").get(getAccomodations);

router.use(validateToken);

// private routes
router.route("/photo/upload-by-link").post(uploadByLink);
router.route("/photo/upload-from-device").post(upload.array('photos', 100), uploadFromDevice);
router.route("/add").post(addAccomodation);
router.route("/my-places").get(getMyAccomodations);
router.route("/:id").get(getAccomodationById).put(updateAccomodation);;

export default router;