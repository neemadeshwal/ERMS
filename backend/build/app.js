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
const app = (0, express_1.default)();
// Manual CORS handling
app.use((req, res, next) => {
    const allowedOrigins = [
        "https://erms-virid.vercel.app",
        "http://localhost:5173",
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,Accept,Origin,Cache-Control,X-File-Name");
    res.setHeader("Access-Control-Max-Age", "86400");
    if (req.method === "OPTIONS") {
        console.log("Preflight request from:", origin); // Optional: for debugging
        res.status(200).end();
        return;
    }
    next();
});
// Middleware
app.use(express_1.default.json());
// Routes
app.use("/api/auth", user_routes_1.default);
app.use("/api/assignments", assignments_routes_1.default);
app.use("/api/projects", projects_routes_1.default);
app.use("/api/engineers", engineers_routes_1.default);
app.use("/", (req, res) => {
    res.status(200).send("Server is up to date");
});
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
