import type { ValidationForm, ValidationFormOptions, YupSchema } from './types';
export declare const useForm: <T extends Record<string, unknown>>(yupSchema: YupSchema<T>, formData: T, options?: ValidationFormOptions) => ValidationForm<T>;
