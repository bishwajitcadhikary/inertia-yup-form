import type { InertiaForm } from '@inertiajs/vue3';
import type { ObjectSchema, ValidationError } from 'yup';
import { FormDataConvertible } from "@inertiajs/core";
export type FormDataType = Record<string, FormDataConvertible>;
export interface ValidationFormOptions {
    rememberKey?: string;
}
export type ParsedErrors<T> = Record<keyof T, string>;
export type ValidationForm<T extends FormDataType> = InertiaForm<T> & {
    errors: Record<string, string | undefined>;
};
export type YupSchema<T extends FormDataType> = ObjectSchema<T>;
export { ValidationError };
