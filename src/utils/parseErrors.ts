import type { ValidationError } from 'yup';
import type { ParsedErrors } from '../types';

export const parseErrors = <T>(error: ValidationError): ParsedErrors<T> => {
    return error.inner.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.path as keyof T]: curr.message,
        }),
        {} as ParsedErrors<T>,
    );
};