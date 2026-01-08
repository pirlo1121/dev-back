"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanAll = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const cleanAll = (req, res, next) => {
    const deepClean = (data) => {
        if (typeof data === 'string') {
            return (0, sanitize_html_1.default)(data.trim());
        }
        if (Array.isArray(data)) {
            return data.map(item => deepClean(item));
        }
        if (data && typeof data === 'object') {
            const cleaned = {};
            for (const key in data) {
                cleaned[key] = deepClean(data[key]);
            }
            return cleaned;
        }
        return data;
    };
    // Solo modificamos el contenido, no la propiedad
    if (req.body) {
        Object.assign(req.body, deepClean(req.body));
    }
    if (req.query) {
        Object.assign(req.query, deepClean(req.query));
    }
    if (req.params) {
        Object.assign(req.params, deepClean(req.params));
    }
    next();
};
exports.cleanAll = cleanAll;
