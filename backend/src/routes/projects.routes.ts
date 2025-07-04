import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  getSingleProjects,
  updateProject,
} from "../controllers/project.controllers";

const ProjectRouter = express.Router();

ProjectRouter.get("/", getProjects);
ProjectRouter.get("/:id", getSingleProjects);
ProjectRouter.post("/", createProject);
ProjectRouter.put("/:id", updateProject);
ProjectRouter.delete("/:id", deleteProject);

export default ProjectRouter;
