import type { ValidationError } from 'yup';
import type { ParsedErrors } from '../types';
export declare const parseErrors: <T>(error: ValidationError) => ParsedErrors<T>;
