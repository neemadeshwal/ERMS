import express from "express";
import {
  getAllEngineer,
  getSingleEngineer,
} from "../controllers/engineers.controllers";

const EngineerRouter = express.Router();

EngineerRouter.get("/", getAllEngineer);
EngineerRouter.get("/:id", getSingleEngineer);
// EngineerRouter.get("/:id/capacity", capacity);

export default EngineerRouter;
