import express from "express";
import {
  createAssignment,
  deleteAssignment,
  getAllAssignments,
  getSingleAssignment,
  updateAssignment,
} from "../controllers/assignments.controllers";
import { authenticated } from "../middleware/auth.middleware";

const AssignmentRouter = express.Router();

AssignmentRouter.get("/", authenticated, getAllAssignments);
AssignmentRouter.post("/", authenticated, createAssignment),
  AssignmentRouter.get("/:id", authenticated, getSingleAssignment),
  AssignmentRouter.put("/:id", authenticated, updateAssignment);

AssignmentRouter.delete("/:id", authenticated, deleteAssignment);

export default AssignmentRouter;
