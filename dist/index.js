"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const configDb_1 = require("./src/config/configDb");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
const projects_routes_1 = __importDefault(require("./src/routes/projects.routes"));
const contact_routes_1 = __importDefault(require("./src/routes/contact.routes"));
const errorHandler_1 = require("./src/middlewares/errorHandler");
const cleanAll_1 = require("./src/middlewares/cleanAll");
const app = (0, express_1.default)();
dotenv_1.default.config({ quiet: true });
(0, configDb_1.connectDb)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200', // IP angular
    credentials: true
}));
// clena routes
app.use(cleanAll_1.cleanAll);
// ROUTES
app.use('/api', auth_routes_1.default);
app.use('/api', projects_routes_1.default);
app.use('/api', contact_routes_1.default);
// Error Handlers
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
app.listen(3000, () => {
    console.log(`Server running in port `, 3000);
});
