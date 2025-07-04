"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const assignments_routes_1 = __importDefault(require("./routes/assignments.routes"));
const projects_routes_1 = __importDefault(require("./routes/projects.routes"));
const engineers_routes_1 = __importDefault(require("./routes/engineers.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["https://erms-virid.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(express_1.default.json());
app.use("/api/auth", user_routes_1.default);
app.use("/api/assignments", assignments_routes_1.default);
app.use("/api/projects", projects_routes_1.default);
app.use("/api/engineers", engineers_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
