import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler } from "../middleware/error.middleware";
import ErrorHandler from "../utils/errorHandler";
import { Assignment } from "../models/assignment/assignment.model";
import { User } from "../models/auth/user.model";
import { Project } from "../models/project/project.model";

// Validation helper
function validateAssignment(body: any): string[] {
  const errors: string[] = [];
  if (!body.engineerId) errors.push("Engineer is required");
  if (!body.projectId) errors.push("Project is required");
  if (
    typeof body.allocation !== "number" ||
    body.allocation < 1 ||
    body.allocation > 100
  )
    errors.push("Allocation must be between 1 and 100");
  if (!body.role || body.role.length < 2) errors.push("Role is required");
  if (!body.startDate) errors.push("Start date is required");
  if (!body.endDate) errors.push("End date is required");
  if (!["active", "completed", "on-hold"].includes(body.status))
    errors.push("Status must be active, completed, or on-hold");
  if (!["high", "medium", "low"].includes(body.priority))
    errors.push("Priority must be high, medium, or low");
  if (!body.description || body.description.length < 5)
    errors.push("Description is required and must be at least 5 characters");
  return errors;
}

// CREATE Assignment Controller
export const createAssignment = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Map 'allocation' to 'allocationPercentage' if present
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    if (req.body.allocation && !req.body.allocationPercentage) {
      req.body.allocationPercentage = req.body.allocation;
    }

    // Ensure allocationPercentage is a number
    if (typeof req.body.allocationPercentage === "string") {
      req.body.allocationPercentage = Number(req.body.allocationPercentage);
    }

    const errors = validateAssignment(req.body);
    if (errors.length) {
      return next(new ErrorHandler(errors.join(", "), 400));
    }

    // Ensure engineerId is always an array
    let engineerIds: string[] = [];
    if (Array.isArray(req.body.engineerId)) {
      engineerIds = req.body.engineerId;
    } else if (req.body.engineerId) {
      engineerIds = [req.body.engineerId];
    }

    // Find the first engineer (for capacity update)
    const engineer = await User.findById(engineerIds[0]);
    if (!engineer) {
      return next(new ErrorHandler("Engineer not found.", 404));
    }

    // Update engineer's currentCapacity
    const allocation = Number(req.body.allocationPercentage) || 0;
    engineer.currentCapacity = Number(engineer.currentCapacity) + allocation;
    await engineer.save();

    // Save assignment with engineerId as array
    const assignment = await Assignment.create({
      ...req.body,
      engineerId: engineerIds,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  }
);

// READ All Assignments
export const getAllAssignments = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const assignments = await Assignment.find()
      .populate("engineerId")
      .populate("projectId")
      .populate("assignedBy");
    res.status(200).json({
      success: true,
      assignments,
    });
  }
);
export const getSingleAssignment = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const assignment = await Assignment.findOne({ _id: id })
      .populate("projectId")
      .populate("engineerId")
      .populate("assignedBy");
    res.status(200).json({
      success: true,
      assignment,
    });
  }
);
// UPDATE Assignment by ID
// UPDATE Assignment by ID
export const updateAssignment = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const { id } = req.params;
    const errors = validateAssignment(req.body);
    if (errors.length) {
      return next(new ErrorHandler(errors.join(", "), 400));
    }

    // Find the current assignment before update
    const currentAssignment = await Assignment.findById(id);
    if (!currentAssignment) {
      return next(new ErrorHandler("Assignment not found", 404));
    }

    // Update the assignment
    const updated = await Assignment.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return next(new ErrorHandler("Assignment not found after update", 404));
    }

    // If the status changed to "completed" (and wasn't completed before)
    if (
      req.body.status === "completed" &&
      currentAssignment.status !== "completed"
    ) {
      // Find the related project
      const project = await Project.findById(updated.projectId);
      if (project) {
        // Increase progress by allocationPercentage (or your custom logic)
        const allocation = Number(updated.allocationPercentage) || 0;
        project.progress = Math.min(
          100,
          (Number(project.progress) || 0) + allocation
        );
        await project.save();
      }
      // Optionally: else, handle project not found
    }

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      assignment: updated,
    });
  }
);

// DELETE Assignment by ID
export const deleteAssignment = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const { id } = req.params;
    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) {
      return next(new ErrorHandler("Assignment not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  }
);
