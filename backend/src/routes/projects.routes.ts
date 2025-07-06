import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  getSingleProjects,
  updateProject,
} from "../controllers/project.controllers";
import { authenticated } from "../middleware/auth.middleware";

const ProjectRouter = express.Router();

ProjectRouter.get("/", authenticated, getProjects);
ProjectRouter.get("/:id", authenticated, getSingleProjects);
ProjectRouter.post("/", authenticated, createProject);
ProjectRouter.put("/:id", authenticated, updateProject);
ProjectRouter.delete("/:id", authenticated, deleteProject);

export default ProjectRouter;
