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
exports.Assignment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const assignmentSchema = new mongoose_1.Schema({
    engineerId: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
            required: [true, "Engineer ID is required."],
        },
    ],
    projectId: {
        type: mongoose_1.Types.ObjectId,
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
        type: mongoose_1.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.Assignment = mongoose_1.default.model("Assignment", assignmentSchema);
