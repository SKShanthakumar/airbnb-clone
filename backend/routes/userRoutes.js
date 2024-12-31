import express from 'express'
import validateToken from '../middleware/validateTokenhandler.js'
import {registerUser, loginUser, currentUser} from '../controllers/userController.js'

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/current").get(validateToken, currentUser);

export default router;