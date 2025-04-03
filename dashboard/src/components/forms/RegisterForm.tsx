import { useForm } from '@tanstack/react-form';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import axios from 'axios';

const RegisterForm = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validators: {
      onSubmit: z
        .object({
          email: z.string().email('Invalid Email'),
          password: z
            .string()
            .min(8, 'Password must be over 8 characters long'),
          passwordConfirm: z
            .string()
            .min(8, 'Password must be over 8 characters long'),
        })
        .refine((data) => data.password === data.passwordConfirm, {
          message: 'Passwords do not match',
          path: ['passwordConfirm'],
        }),
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await axios.post(
          'http://localhost:7001/api/v1/register',
          {
            ...value,
          },
        );
        console.log(response.data);
        redirect({ to: '/', from: '/register' });
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex max-w-sm flex-col gap-4"
      >
        <form.Field
          name="email"
          children={(field) => (
            <div className="flex flex-col">
              <label htmlFor={field.name} className="text-sm">
                Email:
              </label>
              <input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="rounded-xl border-1 border-slate-800 bg-white px-4 py-1 shadow-md"
              />
            </div>
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <div className="flex flex-col">
              <label htmlFor={field.name} className="text-sm">
                Password:
              </label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="rounded-xl border-1 border-slate-800 bg-white px-4 py-1 shadow-md"
              />
            </div>
          )}
        />
        <form.Field
          name="passwordConfirm"
          children={(field) => (
            <div className="flex flex-col">
              <label htmlFor={field.name} className="text-sm">
                Password Confirm:
              </label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="rounded-xl border-1 border-slate-800 bg-white px-4 py-1 shadow-md"
              />
            </div>
          )}
        />
        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-slate-800 px-6 py-1 text-center text-white shadow-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
