"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useForm = void 0;
const vue3_1 = require("@inertiajs/vue3");
const vue_1 = require("vue");
const parseErrors_1 = require("./utils/parseErrors");
const useForm = (yupSchema, formData, options) => {
    // The signature for useForm has changed in v2
    // It now accepts either (data) or (rememberKey, data)
    const inertiaForm = (options === null || options === void 0 ? void 0 : options.rememberKey)
        ? (0, vue3_1.useForm)(options.rememberKey, formData)
        : (0, vue3_1.useForm)(formData);
    const data = (0, vue_1.computed)(() => inertiaForm.data());
    (0, vue_1.watch)(data, (newVal, oldVal) => {
        const diffs = Object.entries(newVal).filter(([key, value]) => oldVal[key] !== value);
        diffs.forEach(([key, value]) => {
            const fieldSchema = yupSchema.pick([key]);
            try {
                fieldSchema.validateSync({ [key]: value }, { abortEarly: false });
                // In v2, clearErrors() is now used instead of directly modifying the errors object
                inertiaForm.clearErrors(key);
            }
            catch (err) {
                if (err instanceof Error && 'inner' in err) {
                    const errors = (0, parseErrors_1.parseErrors)(err);
                    // The setError method now accepts a key and value pair or an object of errors
                    if (errors[key]) {
                        inertiaForm.setError(key, errors[key]);
                    }
                }
            }
        });
    });
    return new Proxy(inertiaForm, {
        get: (target, prop) => {
            if (prop === 'submit') {
                // Clear all existing errors before validation
                inertiaForm.clearErrors();
                try {
                    yupSchema.validateSync(inertiaForm.data(), {
                        abortEarly: false,
                    });
                }
                catch (err) {
                    if (err instanceof Error && 'inner' in err) {
                        const errors = (0, parseErrors_1.parseErrors)(err);
                        // In v2, setError can accept an object of errors
                        inertiaForm.setError(errors);
                        return () => {
                            // Do nothing - just prevent form submission
                        };
                    }
                }
            }
            return target[prop];
        },
    });
};
exports.useForm = useForm;
