import type { InertiaForm } from '@inertiajs/vue3';
import type { ObjectSchema, ValidationError } from 'yup';

export interface ValidationFormOptions {
    rememberKey?: string;
}

export type ParsedErrors<T> = Record<keyof T, string>;

export type ValidationForm<T extends Record<string, any>> = InertiaForm<T> & {
    errors: Record<string, string | undefined>;
};

export type YupSchema<T extends Record<string, any>> = ObjectSchema<T>;
export { ValidationError };