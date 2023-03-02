"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const validateOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };
        try {
            const newReqBody = yield schema.validateAsync(req.body, validateOptions);
            req.body = newReqBody;
            next();
        }
        catch (err) {
            const errors = [];
            err.details.forEach((e) => {
                errors.push(e.message);
            });
            return res.status(409).json({ status: 'failed', message: errors });
        }
    });
};
