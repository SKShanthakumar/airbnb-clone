import express from 'express'
import validateToken from '../middleware/validateTokenhandler.js'
import { registerUser, loginUser, currentUser, logoutUser, getUserById, updateUser } from '../controllers/userController.js'

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/current").get(validateToken, currentUser);
router.route("/logout").post(validateToken, logoutUser);
router.route("/:id").get(getUserById);
router.route("/update").put(validateToken, updateUser);

export default router;