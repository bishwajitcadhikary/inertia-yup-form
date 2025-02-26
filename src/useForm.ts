import { useForm as inertiaUseForm } from '@inertiajs/vue3';
import { computed, watch } from 'vue';
import type { ValidationForm, ValidationFormOptions, YupSchema, FormDataType } from './types';
import { parseErrors } from './utils/parseErrors';

export const useForm = <T extends FormDataType>(
    yupSchema: YupSchema<T>,
    formData: T,
    options?: ValidationFormOptions,
): ValidationForm<T> => {
    // The signature for useForm has changed in v2
    // It now accepts either (data) or (rememberKey, data)
    const inertiaForm = options?.rememberKey
        ? inertiaUseForm(options.rememberKey, formData)
        : inertiaUseForm(formData);

    type FormType = typeof inertiaForm;
    const data = computed(() => inertiaForm.data());

    watch(data, (newVal, oldVal) => {
        const diffs = Object.entries(newVal).filter(([key, value]) => oldVal[key] !== value);

        diffs.forEach(([key, value]) => {
            const fieldSchema = yupSchema.pick([key]);

            try {
                fieldSchema.validateSync({ [key]: value }, { abortEarly: false });
                // In v2, clearErrors() is now used instead of directly modifying the errors object
                inertiaForm.clearErrors(key);
            } catch (err) {
                if (err instanceof Error && 'inner' in err) {
                    const errors = parseErrors<T>(err as any);
                    // The setError method now accepts a key and value pair or an object of errors
                    if (errors[key]) {
                        inertiaForm.setError(key, errors[key]);
                    }
                }
            }
        });
    });

    return new Proxy<FormType>(inertiaForm, {
        get: (target, prop) => {
            if (prop === 'submit') {
                // Clear all existing errors before validation
                inertiaForm.clearErrors();

                try {
                    yupSchema.validateSync(inertiaForm.data(), {
                        abortEarly: false,
                    });
                } catch (err) {
                    if (err instanceof Error && 'inner' in err) {
                        const errors = parseErrors<T>(err as any);
                        // In v2, setError can accept an object of errors
                        inertiaForm.setError(errors);
                        return () => {
                            // Do nothing - just prevent form submission
                        };
                    }
                }
            }

            return target[prop as keyof typeof target];
        },
    });
};