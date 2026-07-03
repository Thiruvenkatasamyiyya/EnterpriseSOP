
import express from "express";
import { isAuthenticatedUser,authorizeRoles } from "../middlewares/auth.js";
import { adminPermit, allUsers, deleteUser, forgotPassword, getUserDetails, loginUser, logout, me, registerUser, resetPassword, updatePassword, updateUser } from "../controller/userController.js";


const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me").get(isAuthenticatedUser,me)
router.route("/admin/users").get(allUsers); // authorizedRoles()later on
router.route("/admin/users/:id")
.get(isAuthenticatedUser, authorizeRoles("admin"),getUserDetails)
.put(isAuthenticatedUser, authorizeRoles("admin"),updateUser)
.delete(isAuthenticatedUser, authorizeRoles("admin"),deleteUser)
router.route("/admin/permit").patch(isAuthenticatedUser,adminPermit)

export default router;