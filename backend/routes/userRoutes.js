import express from 'express'
import validateToken from '../middleware/validateTokenhandler.js'
import { registerUser, loginUser, currentUser, logoutUser, getUserById, updateUser, setProfilePic, removeProfilePic } from '../controllers/userController.js'
import uploadProfile from '../middleware/multerConfigUser.js';

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/current").get(validateToken, currentUser);
router.route("/logout").post(validateToken, logoutUser);
router.route("/:id").get(getUserById);
router.route("/update").put(validateToken, updateUser);

router.route("/set-profile-pic").post(validateToken, uploadProfile.single('photo'), setProfilePic);
router.route("/remove-profile-pic").post(validateToken, removeProfilePic);
router.route("/add-to-favourites");
router.route("/remove-from-favourites");

export default router;