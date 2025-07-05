"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        validate: {
            validator: validator_1.default.default.isEmail,
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
        enum: ["senior", "mid", "junior"],
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
            type: mongoose_1.Types.ObjectId,
            ref: "ProjectId",
        },
    ],
    Assignments: [
        {
            type: mongoose_1.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("User", userSchema);
