import express from "express";
import {
  getAllEngineer,
  getSingleEngineer,
  editEngineer,
} from "../controllers/engineers.controllers";
import { authenticated } from "../middleware/auth.middleware";

const EngineerRouter = express.Router();

EngineerRouter.get("/", authenticated, getAllEngineer);
EngineerRouter.get("/:id", authenticated, getSingleEngineer);
EngineerRouter.put("/edit", authenticated, editEngineer);

export default EngineerRouter;
