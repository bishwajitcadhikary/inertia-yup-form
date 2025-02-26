import type { ValidationForm, ValidationFormOptions, YupSchema, FormDataType } from './types';
export declare const useForm: <T extends FormDataType>(yupSchema: YupSchema<T>, formData: T, options?: ValidationFormOptions) => ValidationForm<T>;
