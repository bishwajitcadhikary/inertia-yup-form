# Inertia Yup Form

A utility package that combines Inertia.js forms with Yup validation for Vue 3 applications.

## Installation

```bash
npm install @kindigi/inertia-yup-form

# or

yarn add @kindigi/inertia-yup-form

# or

pnpm add @kindigi/inertia-yup-form
```

## Usage

```typescript
import { useForm } from '@kindigi/inertia-yup-form';
import * as yup from 'yup';

// Define your form schema
const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

// Define your form data
const formData = {
  name: '',
  email: '',
};

// Use the form
const form = useForm(schema, formData);

// Optional: Use with remember key
const form = useForm(schema, formData, { rememberKey: 'contact-form' });
```

## Translations (Optional)
You can override the default Yup error messages by setting the locale. Here is an example using [Laravel Vue i18n](https://github.com/xiCO2k/laravel-vue-i18n):

```typescript
import { trans } from 'laravel-vue-i18n';
import * as yup from 'yup';

const getPath = (path: string) => {
    return path.replace('_', ' ');
};

yup.setLocale({
    mixed: {
        required: ({ path }) => {
            return trans('validation.required', { attribute: getPath(path) });
        },
        default: ({ path }) => trans('validation.invalid', { attribute: getPath(path) }),
    },
    string: {
        email: ({ path }) => trans('validation.email', { attribute: getPath(path) }),
        min: ({ path, min }) =>
            trans('validation.min.string', {
                attribute: getPath(path),
                min: min.toString(),
            }),
        max: ({ path, max }) =>
            trans('validation.max.string', {
                attribute: getPath(path),
                max: max.toString(),
            }),
    },
    number: {
        min: ({ path, min }) =>
            trans('validation.min.numeric', {
                attribute: getPath(path),
                min: min.toString(),
            }),
        max: ({ path, max }) =>
            trans('validation.max.numeric', {
                attribute: getPath(path),
                max: max.toString(),
            }),
        lessThan: ({ path, less }) =>
            trans('validation.lt.numeric', {
                attribute: getPath(path),
                less: less.toString(),
            }),
        moreThan: ({ path, more }) =>
            trans('validation.gt.numeric', {
                attribute: getPath(path),
                more: more.toString(),
            }),
    },
    array: {
        min: ({ path, min }) =>
            trans('validation.min.array', {
                attribute: getPath(path),
                min: min.toString(),
            }),
        max: ({ path, max }) =>
            trans('validation.max.array', {
                attribute: getPath(path),
                max: max.toString(),
            }),
    },
});

export default yup;
```

```typescript

## Features

- Real-time client-side validation using Yup schemas
- Integration with Inertia.js forms
- TypeScript support
- Form state persistence with remember key

## TODO

- [ ] Intract with all other options of Inertia.js form (post, put, patch, delete)