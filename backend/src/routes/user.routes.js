// src/routes/user.routes.js
import express from 'express';
import { authSelfController, changePasswordController, changeUserRoleController, getAllUsersController, singleUserController, updateUserNameController } from '../controllers/user.controllers.js';
import protectRoute from '../middlewares/authMiddleware.js';
const router = express.Router();

// change password (protected route) can be added later
router.post("/change-password", protectRoute(), changePasswordController);

// Route to get authenticated user's data
router.get("/me", protectRoute(), authSelfController);

// Example route to update user data
router.patch("/change-username", protectRoute(),  updateUserNameController);


router.get("/all-users", protectRoute({requireVerified:true, allowedRoles:['admin','superAdmin']}),   getAllUsersController);

// user role change route 
router.patch("/role/:id", protectRoute({ allowedRoles: ["superAdmin"], requireVerified: true }),changeUserRoleController);

// single user , [admin, superAdmin] permissions
router.get("/:id", protectRoute({requireVerified:true, allowedRoles:['admin', 'superAdmin', 'admin']}),   singleUserController);



export default router;