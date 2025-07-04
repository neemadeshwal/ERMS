import mongoose, { Schema, Types } from "mongoose";
import validator from "validator";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project Name is required."],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required."],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required."],
    },
    requiredSkills: {
      type: [String],
      enum: [
        "React",
        "Vue",
        "Angular",
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Python",
        "Java",
        "Go",
        "Rust",
        "MongoDB",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Mobile Development",
        "DevOps",
        "Testing",
      ],
    },
    teamSize: {
      type: Number,
      required: [true, "Team size is required."],
      min: 1,
      max: 50,
    },

    managerId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Project manager is required."],
    },
    progress: {
      type: Number,
      default: 0,
    },
    teamMembers: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["developer", "designer", "tester", "devops", "architect"],
        },
        allocatedHours: {
          type: Number,
          min: 0,
          max: 40, // per week
        },
        joinDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["active", "inactive"],
          default: "active",
        },
      },
    ],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "cancelled"],
      default: "planning",
    },
    projectType: {
      type: String,
      enum: [
        "web-app",
        "mobile-app",
        "api",
        "infrastructure",
        "data-pipeline",
        "ml",
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", projectSchema);
