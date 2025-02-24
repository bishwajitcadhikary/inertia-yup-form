# Inertia Yup Form

A utility package that combines Inertia.js forms with Yup validation for Vue 3 applications.

## Installation

```bash
npm install @kindigi/inertia-yup-form
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

## Features

- Real-time validation using Yup schemas
- Integration with Inertia.js forms
- TypeScript support
- Form state persistence with remember key