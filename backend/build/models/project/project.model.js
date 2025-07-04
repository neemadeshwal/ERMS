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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const projectSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Types.ObjectId,
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
                type: mongoose_1.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.Project = mongoose_1.default.model("Project", projectSchema);
