import express from "express";
import {
  createAssignment,
  deleteAssignment,
  getAllAssignments,
  getSingleAssignment,
  updateAssignment,
} from "../controllers/assignments.controllers";

const AssignmentRouter = express.Router();

AssignmentRouter.get("/", getAllAssignments);
AssignmentRouter.post("/", createAssignment),
  AssignmentRouter.get("/:id", getSingleAssignment),
  AssignmentRouter.put("/:id", updateAssignment);

AssignmentRouter.delete("/:id", deleteAssignment);

export default AssignmentRouter;
