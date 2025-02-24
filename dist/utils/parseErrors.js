"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseErrors = void 0;
const parseErrors = (error) => {
    return error.inner.reduce((acc, curr) => ({
        ...acc,
        [curr.path]: curr.message,
    }), {});
};
exports.parseErrors = parseErrors;
