import { useForm as inertiaUseForm } from '@inertiajs/vue3';
import { computed, watch } from 'vue';
import type { ValidationForm, ValidationFormOptions, YupSchema, FormDataType } from './types';
import { parseErrors } from './utils/parseErrors';

export const useForm = <T extends FormDataType>(
    yupSchema: YupSchema<T>,
    formData: T,
    options?: ValidationFormOptions,
): ValidationForm<T> => {
    const inertiaForm = options?.rememberKey
        ? inertiaUseForm<T>(options.rememberKey, formData)
        : inertiaUseForm<T>(formData);

    type FormType = typeof inertiaForm;
    const data = computed(() => inertiaForm.data());

    watch(data, (newVal, oldVal) => {
        const diffs = Object.entries(newVal).filter(([key, value]) => oldVal[key] !== value);

        diffs.forEach(([key, value]) => {
            const fieldSchema = yupSchema.pick([key]);

            try {
                fieldSchema.validateSync({ [key]: value }, { abortEarly: false });
                delete inertiaForm.errors[key];
            } catch (err) {
                if (err instanceof Error && 'inner' in err) {
                    const errors = parseErrors<T>(err as any);
                    inertiaForm.setError({ ...inertiaForm.errors, ...errors });
                }
            }
        });
    });

    return new Proxy<FormType & { errors: Record<string, string | undefined> }>(inertiaForm, {
        get: (target, prop) => {
            if (prop === 'submit') {
                inertiaForm.clearErrors();

                try {
                    yupSchema.validateSync(inertiaForm.data(), {
                        abortEarly: false,
                    });
                } catch (err) {
                    if (err instanceof Error && 'inner' in err) {
                        const errors = parseErrors<T>(err as any);
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