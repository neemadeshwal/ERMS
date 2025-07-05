import mongoose, { Schema, Types } from "mongoose";

const assignmentSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Please provide description."],
    },
    engineerId: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "Engineer ID is required."],
      },
    ],
    projectId: {
      type: Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required."],
    },

    allocationPercentage: {
      type: Number,
      required: [true, "Allocation percentage is required."],
      min: [0, "Allocation cannot be negative."],
      max: [100, "Allocation cannot exceed 100%."],
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

    role: {
      type: String,
      required: [true, "Role is required."],
      enum: [
        "developer",
        "senior-developer",
        "tech-lead",
        "architect",
        "designer",
        "tester",
        "devops",
        "project-manager",
      ],
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "on-hold"],
      default: "active",
    },

    assignedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
    },

    actualStartDate: {
      type: Date,
    },
    actualEndDate: {
      type: Date,
    },
    hoursLogged: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },

    skillsUsed: {
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
  },
  {
    timestamps: true,
  }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
