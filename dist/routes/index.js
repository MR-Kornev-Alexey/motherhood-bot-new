import { Router } from "express";
const router = Router();
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import UsersController from "../controllers/UsersController.js";
import DataController from "../controllers/DataController.js";
// Auth Routes
router.post("/auth/login", AuthController.login);
//  User Routes
router.get("api/webinars", authMiddleware, UsersController.getAllUsers);
router.get("/webinars", DataController.getAllWebinars);
export default router;
