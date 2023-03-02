"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const breakObject = (o) => {
    let string = '{';
    for (var key in o) {
        string += `\n    ${key}: ${o[key]}`;
    }
    string += '\n}';
    return string;
};
exports.default = (fields) => {
    let string = "";
    Object.keys(fields).map((key) => {
        const value = fields[key];
        let appendix = "";
        if (typeof value === "object")
            appendix = `\n${key}: ${breakObject(value)}`;
        else
            appendix = `\n${key}: ${value}`;
        string += appendix;
    });
    return string;
};
