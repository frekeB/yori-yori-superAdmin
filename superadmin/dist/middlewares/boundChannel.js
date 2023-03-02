"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (ch) => {
    return (req, res, next) => {
        req.channel = ch;
        next();
    };
};
