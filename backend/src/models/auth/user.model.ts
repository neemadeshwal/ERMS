import mongoose, { Schema, Types } from "mongoose";
import validator from "validator";
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      validate: {
        validator: validator.default.isEmail,
        message: "Please enter a valid email address.",
      },
      unique: [true, "Email already exists."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    role: {
      type: String,
      enum: ["engineer", "manager"],
      required: [true, "Role is required."],
    },
    code: {
      type: String,
      required: [true, "code is required"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
    },
    employmentType: {
      type: String,
      enum: ["fullTime", "partTime"],
    },
    maxCapacity: {
      type: Number,
      enum: [50, 100, 0],
    },
    currentCapacity: {
      type: Number,
      default: 0,
    },

    skills: {
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

    availableFrom: {
      type: Date,
      default: Date.now,
    },

    seniority: {
      type: String,
      enum: ["senior", "mid", "junior", "intern", "staff"],
    },

    department: {
      type: String,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 50,
    },

    workType: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "hybrid",
    },
    preferredProjectTypes: {
      type: [String],
      enum: [
        "web-app",
        "mobile-app",
        "api",
        "infrastructure",
        "data-pipeline",
        "ml",
      ],
    },
    avatar: {
      type: String,
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    location: {
      type: String,
    },
    Projects: [
      {
        type: Types.ObjectId,
        ref: "ProjectId",
      },
    ],
    Assignments: [
      {
        type: Types.ObjectId,
        ref: "AssignmentId",
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "on-leave", "terminated"],
      default: "active",
    },
    hireDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
