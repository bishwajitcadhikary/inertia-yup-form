"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useForm = void 0;
const vue3_1 = require("@inertiajs/vue3");
const vue_1 = require("vue");
const parseErrors_1 = require("./utils/parseErrors");
const useForm = (yupSchema, formData, options) => {
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
                delete inertiaForm.errors[key];
            }
            catch (err) {
                if (err instanceof Error && 'inner' in err) {
                    const errors = (0, parseErrors_1.parseErrors)(err);
                    inertiaForm.setError({ ...inertiaForm.errors, ...errors });
                }
            }
        });
    });
    return new Proxy(inertiaForm, {
        get: (target, prop) => {
            if (prop === 'submit') {
                inertiaForm.clearErrors();
                try {
                    yupSchema.validateSync(inertiaForm.data(), {
                        abortEarly: false,
                    });
                }
                catch (err) {
                    if (err instanceof Error && 'inner' in err) {
                        const errors = (0, parseErrors_1.parseErrors)(err);
                        inertiaForm.setError(errors);
                        return () => {
                            // Do nothing
                        };
                    }
                }
            }
            return target[prop.toString()];
        },
    });
};
exports.useForm = useForm;
