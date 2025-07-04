import express from "express";
import { getUser, loginUser, newUser } from "../controllers/user.controllers";
import { authenticated } from "../middleware/auth.middleware";

const userRouter = express.Router();

userRouter.post("/login", loginUser);

userRouter.post("/new", newUser);

userRouter.get("/profile", authenticated, getUser);

export default userRouter;
