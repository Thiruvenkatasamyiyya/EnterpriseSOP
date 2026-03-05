// 

import express from "express";
// import {registerUser, loginUser, logout, forgotPassword, resetPassword, updatePassword,allUsers,getUserDetails,updateUser,deleteUser} from "../controllers/userController.js";

import { isAuthenticatedUser,authorizeRoles } from "../middlewares/auth.js";
import { allUsers, deleteUser, forgotPassword, getUserDetails, loginUser, logout, registerUser, resetPassword, updatePassword, updateUser } from "../controller/userController.js";


const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);


router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"),allUsers);
router.route("/admin/users/:id")
.get(isAuthenticatedUser, authorizeRoles("admin"),getUserDetails)
.put(isAuthenticatedUser, authorizeRoles("admin"),updateUser)
.delete(isAuthenticatedUser, authorizeRoles("admin"),deleteUser)

export default router;