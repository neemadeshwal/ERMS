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
// ===== Allowed Origins =====
const allowedOrigins = [
    "https://erms-virid.vercel.app",
    "http://localhost:5173",
];
// ===== Manual CORS Middleware =====
function corsManual(req, res, next) {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    // Always set these headers for CORS
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    // Handle preflight (OPTIONS) requests
    if (req.method === "OPTIONS") {
        // Respond with 200 and headers only, no body
        return res.status(200).end();
    }
    // Continue to next middleware/route
    next();
}
// ===== Express App Setup =====
const app = (0, express_1.default)();
app.use(corsManual); // Manual CORS middleware (must be first)
app.use(express_1.default.json()); // JSON body parser
// ===== Routers =====
app.use("/api/auth", user_routes_1.default);
app.use("/api/assignments", assignments_routes_1.default);
app.use("/api/projects", projects_routes_1.default);
app.use("/api/engineers", engineers_routes_1.default);
// ===== Root Route =====
app.get("/", (req, res) => {
    res.status(200).send("Server is up to date");
});
// ===== Error Middleware =====
app.use(error_middleware_1.errorMiddleware);
// ===== 404 Handler (Optional) =====
app.use((req, res) => {
    res.status(404).json({ error: "Not Found", message: "An error occured" });
});
exports.default = app;
